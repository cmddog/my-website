package com.cmddog.features.chat

import com.cmddog.features.chat.models.api.ChatEvent
import com.cmddog.features.chat.models.api.ChatMessage
import com.cmddog.features.chat.models.api.messageUpdate
import kotlinx.coroutines.channels.BufferOverflow
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.sync.Mutex
import kotlinx.coroutines.sync.withLock
import java.time.Instant

object ChatService {
    private const val HISTORY_SIZE = 100
    private var messageCounter = 0L
    private val historyMutex = Mutex()
    private val history = ArrayDeque<ChatMessage>(HISTORY_SIZE)

    // extraBufferCapacity prevents slow clients from blocking the broadcaster
    private val eventFlow = MutableSharedFlow<ChatEvent>(
        extraBufferCapacity = 16,
        onBufferOverflow = BufferOverflow.DROP_OLDEST
    )

    suspend fun getMessage(id: Long) = historyMutex.withLock { history.find { it.id == id } }

    suspend fun deleteMessage(id: Long) {
        val event = historyMutex.withLock {
            val msg = history.find { it.id == id } ?: return@withLock null
            msg.deleted = true
            msg.content = "[deleted message]"
            ChatEvent.messageUpdate(msg)
        }
        if (event != null) broadcast(event)
    }

    suspend fun addMessage(sender: String, content: String): ChatMessage {
        val msg = ChatMessage(++messageCounter, sender, content, Instant.now().toEpochMilli(), false)
        historyMutex.withLock {
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
