package com.cmddog.core

import io.ktor.server.application.*
import io.ktor.server.sessions.*
import kotlinx.serialization.Serializable

@Serializable
data class AdminSession(val sessionId: String)

@Serializable
data class UserSession(val username: String, val sessionId: String)

@Serializable
data class GuestSession(val guestNumber: Int, val sessionId: String)

fun Application.configureSessions() {
    install(Sessions) {
        cookie<AdminSession>("ADMIN_SESSION") {
            cookie.path = "/"
            cookie.maxAgeInSeconds = 60 * 60 * 24 // 1 day
            cookie.httpOnly = true
            cookie.secure = true
        }
        cookie<UserSession>("USER_SESSION") {
            cookie.path = "/"
            cookie.maxAgeInSeconds = 60 * 60 * 24 * 7 // 7 days
            cookie.httpOnly = true
            cookie.secure = true
        }
        cookie<GuestSession>("GUEST_SESSION") {
            cookie.path = "/"
            cookie.maxAgeInSeconds = 60 * 60 * 8 // 8 hours
            cookie.httpOnly = true
            cookie.secure = true
        }
    }
}
