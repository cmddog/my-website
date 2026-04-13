package com.cmddog.core

import io.ktor.server.application.*
import io.ktor.server.plugins.ratelimit.*
import kotlin.time.Duration.Companion.seconds

fun Application.configureRateLimiting() {
    install(RateLimit) {
        register(RateLimitName("auth")) {
            rateLimiter(limit = 100, refillPeriod = 10.seconds)
        }
        register(RateLimitName("chat-user")) {
            rateLimiter(limit = 60, refillPeriod = 60.seconds)
        }
        register(RateLimitName("chat-guest")) {
            rateLimiter(limit = 15, refillPeriod = 60.seconds)
        }
    }
}
