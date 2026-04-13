package com.cmddog.core.models.api

import kotlinx.serialization.Serializable

@Serializable
data class ErrorResponse(
    val message: String,
)
