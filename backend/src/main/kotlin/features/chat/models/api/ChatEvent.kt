package com.cmddog.features.chat.models.api

import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json

@Serializable
enum class ChatEventType { MESSAGE, HISTORY, JOIN, LEAVE, MESSAGE_UPDATE }

@Serializable
data class ChatEvent(val type: ChatEventType, val payload: String) {
    companion object
}

fun ChatEvent.Companion.messageUpdate(msg: ChatMessage) = ChatEvent(ChatEventType.MESSAGE_UPDATE, Json.encodeToString(msg))
