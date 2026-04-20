package com.cmddog.core

import io.ktor.server.application.*
import io.ktor.server.plugins.ratelimit.*
import kotlin.time.Duration.Companion.seconds

fun Application.configureRateLimiting() {
    install(RateLimit) {
        register(RateLimitName("auth")) {
            rateLimiter(limit = 10, refillPeriod = 10.seconds)
        }
        register(RateLimitName("user")) {
            rateLimiter(limit = 1, refillPeriod = 1.seconds)
        }
        register(RateLimitName("guest")) {
            rateLimiter(limit = 1, refillPeriod = 4.seconds)
        }
    }
}
