package com.cmddog

import com.cmddog.core.DatabaseSingleton
import com.cmddog.core.configureDatabase
import com.cmddog.core.configureRateLimiting
import com.cmddog.core.configureRouting
import com.cmddog.core.configureSerialization
import com.cmddog.core.configureSessions
import io.ktor.server.application.*
import io.ktor.server.sse.*

fun main(args: Array<String>) {
    io.ktor.server.netty.EngineMain.main(args)
}

fun Application.module() {
    install(SSE)
    configureSerialization()
    configureSessions()
    configureRateLimiting()
    DatabaseSingleton.initialize(
        commissions = configureDatabase("commissions"),
        gallery = configureDatabase("gallery"),
        miscellaneous = configureDatabase("miscellaneous")
    )
    configureRouting()
}
