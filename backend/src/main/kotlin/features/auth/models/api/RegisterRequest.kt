package com.cmddog.features.auth.models.api

import kotlinx.serialization.Serializable

@Serializable
data class RegisterRequest (
    val username: String,
    val password: String,
    val securityQuestion: String,
    val securityAnswer: String
)