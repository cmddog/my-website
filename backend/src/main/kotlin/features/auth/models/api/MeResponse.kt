package com.cmddog.features.auth.models.api

import kotlinx.serialization.Serializable

@Serializable
enum class IdentityType { USER, GUEST, ANONYMOUS }

@Serializable
data class MeResponse(
    val type: IdentityType,
    val displayName: String?
)
