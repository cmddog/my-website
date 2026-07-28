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

    fun loadHistory() {
        val db = DatabaseSingleton.miscellaneous

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

        messageCounter = rows.maxOfOrNull { it.id } ?: 0L
    }

    suspend fun getMessage(id: Long) = historyMutex.withLock { history.find { it.id == id } }

    suspend fun deleteMessage(id: Long) {
        val event = historyMutex.withLock {
            val msg = history.find { it.id == id } ?: return@withLock null
            msg.deleted = true
            msg.content = "[deleted message]"

            DatabaseSingleton.miscellaneous.update(ChatMessages) {
                set(it.deleted, true)
                where { it.id eq id }
            }

            ChatEvent.messageUpdate(msg)
        }
        if (event != null) broadcast(event)
    }

    suspend fun addMessage(sender: String, content: String): ChatMessage {
        val timestamp = Instant.now().toEpochMilli()
        return historyMutex.withLock {
            val id = ++messageCounter
            val msg = ChatMessage(id, sender, content, timestamp, false)

            DatabaseSingleton.miscellaneous.insert(ChatMessages) {
                set(it.id, id)
                set(it.sender, sender)
                set(it.content, content)
                set(it.timestamp, timestamp)
                set(it.deleted, false)
            }

            if (history.size >= HISTORY_SIZE) history.removeFirst()
            history.addLast(msg)
            msg
        }
    }

    suspend fun getHistory(): List<ChatMessage> = historyMutex.withLock { history.toList() }

    suspend fun broadcast(event: ChatEvent) {
        eventFlow.emit(event)
    }

    suspend fun subscribe(block: suspend (ChatEvent) -> Unit) {
        eventFlow.collect { block(it) }
    }
}
