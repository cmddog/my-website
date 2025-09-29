package com.example.configuration

import io.ktor.server.application.*
import io.ktor.server.plugins.ratelimit.*
import kotlin.time.Duration.Companion.seconds

fun Application.configureRateLimiting() {
    install(RateLimit) {
        register {
            rateLimiter(limit = 100, refillPeriod = 10.seconds)
        }
    }
}
