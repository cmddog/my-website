package com.cmddog.features.chat.models.api

import kotlinx.serialization.Serializable

@Serializable
data class ChatMessage(
    val id: Long,
    val sender: String,
    val content: String,
    val timestamp: Long
)
