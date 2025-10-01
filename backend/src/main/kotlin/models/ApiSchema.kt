package com.cmddog.models

import kotlinx.serialization.Serializable

@Serializable
data class QueueInfo(
    val clientName: String,
    val type: String,
    val status: String,
    val position: Int
)
