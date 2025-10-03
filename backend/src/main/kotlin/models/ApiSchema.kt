package com.cmddog.models

import kotlinx.serialization.Serializable

@Serializable
data class QueueItem(
    val clientName: String,
    val commissionTypes: List<String>,
    val status: String,
    val position: Int
)
