package com.cmddog.features.chat

import com.cmddog.core.DatabaseSingleton
import com.cmddog.features.chat.models.api.ChatEvent
import com.cmddog.features.chat.models.api.ChatMessage
import com.cmddog.features.chat.models.api.messageUpdate
import com.cmddog.features.chat.models.database.ChatMessages
import kotlinx.coroutines.channels.BufferOverflow
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.sync.Mutex
import kotlinx.coroutines.sync.withLock
import org.ktorm.dsl.*
import java.time.Instant

object ChatService {
    private const val HISTORY_SIZE = 200
    private var messageCounter = 0L
    private val historyMutex = Mutex()
    private val history = ArrayDeque<ChatMessage>(HISTORY_SIZE)

    // extraBufferCapacity prevents slow clients from blocking the broadcaster
    private val eventFlow = MutableSharedFlow<ChatEvent>(
        extraBufferCapacity = 16,
        onBufferOverflow = BufferOverflow.DROP_OLDEST
    )

    /**
     * Loads the last [HISTORY_SIZE] messages from the database into the in-memory deque.
     * Must be called once at application startup, after the database is initialised.
     * Deleted messages are included but their content is replaced with "[deleted message]".
     * The message counter is set to the highest persisted ID so new IDs never collide.
     */
    fun loadHistory() {
        val db = DatabaseSingleton.miscellaneous

        // Fetch the last HISTORY_SIZE rows ordered by id ascending so the deque is in
        // chronological order. We use a sub-query via raw SQL to get the tail efficiently.
        val rows = mutableListOf<ChatMessage>()
        db.useConnection { conn ->
            conn.prepareStatement(
                """
                SELECT id, sender, content, timestamp, deleted
                FROM (
                    SELECT id, sender, content, timestamp, deleted
                    FROM chat_messages
                    ORDER BY id DESC
                    LIMIT ?
                ) sub
                ORDER BY id 
                """.trimIndent()
            ).use { stmt ->
                stmt.setInt(1, HISTORY_SIZE)
                val rs = stmt.executeQuery()
                while (rs.next()) {
                    val deleted = rs.getBoolean("deleted")
                    val content = if (deleted) "[deleted message]" else rs.getString("content")
                    rows.add(
                        ChatMessage(
                            id = rs.getLong("id"),
                            sender = rs.getString("sender"),
                            content = content,
                            timestamp = rs.getLong("timestamp"),
                            deleted = deleted,
                        )
                    )
                }
            }
        }

        history.addAll(rows)

        // Initialise the counter from the highest persisted id (or 0 if the table is empty)
        // so that newly created messages always get a unique, higher id.
        messageCounter = rows.maxOfOrNull { it.id } ?: 0L
    }

    suspend fun getMessage(id: Long) = historyMutex.withLock { history.find { it.id == id } }

    suspend fun deleteMessage(id: Long) {
        val event = historyMutex.withLock {
            val msg = history.find { it.id == id } ?: return@withLock null
            msg.deleted = true
            msg.content = "[deleted message]"

            // Persist the soft-delete to the database (update flag only, never remove the row)
            DatabaseSingleton.miscellaneous.update(ChatMessages) {
                set(it.deleted, true)
                where { it.id eq id }
            }

            ChatEvent.messageUpdate(msg)
        }
        if (event != null) broadcast(event)
    }

    suspend fun addMessage(sender: String, content: String): ChatMessage {
        val id = ++messageCounter
        val timestamp = Instant.now().toEpochMilli()
        val msg = ChatMessage(id, sender, content, timestamp, false)

        historyMutex.withLock {
            // Persist to database before updating the in-memory deque
            DatabaseSingleton.miscellaneous.insert(ChatMessages) {
                set(it.id, id)
                set(it.sender, sender)
                set(it.content, content)
                set(it.timestamp, timestamp)
                set(it.deleted, false)
            }

            if (history.size >= HISTORY_SIZE) history.removeFirst()
            history.addLast(msg)
        }
        return msg
    }

    suspend fun getHistory(): List<ChatMessage> = historyMutex.withLock { history.toList() }

    suspend fun broadcast(event: ChatEvent) {
        eventFlow.emit(event)
    }

    suspend fun subscribe(block: suspend (ChatEvent) -> Unit) {
        eventFlow.collect { block(it) }
    }
}
