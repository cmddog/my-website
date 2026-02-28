package com.cmddog

import com.cmddog.configuration.configureDatabase
import com.cmddog.configuration.configureRateLimiting
import com.cmddog.configuration.configureRouting
import com.cmddog.configuration.configureSerialization
import com.cmddog.configuration.configureSessions
import io.ktor.server.application.*

fun main(args: Array<String>) {
    io.ktor.server.netty.EngineMain.main(args)
}

fun Application.module() {
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
