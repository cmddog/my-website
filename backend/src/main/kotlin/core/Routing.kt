package com.cmddog.core

import com.cmddog.features.admin.adminRoutes
import com.cmddog.features.auth.authRoutes
import com.cmddog.features.chat.chatRoutes
import io.ktor.server.application.Application
import io.ktor.server.routing.route
import io.ktor.server.routing.routing

fun Application.configureRouting() {
    routing {
        route("/api") {
            authRoutes()
            adminRoutes()
            chatRoutes()
        }
    }
}
