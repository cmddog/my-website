package com.cmddog.models

import kotlinx.serialization.Serializable

@Serializable
data class ErrorResponse(
    val message: String,
)

@Serializable
data class QueueItem(
    val clientName: String,
    val commissionTypes: List<String>,
    val status: String,
    val position: Int,
)

// ----- Login -----
@Serializable
data class LoginRequest(
    val password: String,
)
