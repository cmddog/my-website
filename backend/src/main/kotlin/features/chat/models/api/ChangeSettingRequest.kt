package com.cmddog.features.chat.models.api

import kotlinx.serialization.Serializable

@Serializable
enum class ChatSetting {
    disable_guests,
    disable_signups
}

@Serializable
data class ChangeSettingRequest(
    val setting: ChatSetting,
    val setTo: Boolean
)