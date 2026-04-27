package com.cmddog.features.chat.models.api

import kotlinx.serialization.Serializable

@Serializable
enum class ChatEventType { MESSAGE, HISTORY, JOIN, LEAVE }

@Serializable
data class ChatEvent(val type: ChatEventType, val payload: String)
