package com.cmddog.models

import kotlinx.serialization.Serializable

@Serializable
data class ErrorResponse(
    val message: String,
)

// ----- Login -----
@Serializable
data class LoginRequest(
    val password: String,
)
