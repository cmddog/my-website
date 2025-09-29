package com.example.configuration

import io.ktor.server.application.*
import io.ktor.server.sessions.*
import kotlinx.serialization.Serializable

@Serializable
data class AdminSession(val sessionId: String)

fun Application.configureSessions() {
    install(Sessions) {
        cookie<AdminSession>("ADMIN_SESSION") {
            cookie.path = "/"
            cookie.maxAgeInSeconds = 600 // 10 Minutes
        }
    }
}
