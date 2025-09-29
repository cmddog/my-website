package com.example

import com.example.configuration.configureDatabase
import com.example.configuration.configureRateLimiting
import com.example.configuration.configureRouting
import com.example.configuration.configureSerialization
import com.example.configuration.configureSessions
import io.ktor.server.application.*

fun main(args: Array<String>) {
    io.ktor.server.netty.EngineMain.main(args)
}

fun Application.module() {
    configureSerialization()
    configureSessions()
    configureRateLimiting()
    configureDatabase()
    configureRouting()
}
