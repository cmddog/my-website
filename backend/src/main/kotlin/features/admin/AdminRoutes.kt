package com.cmddog.features.admin

import com.cmddog.core.AdminSession
import com.cmddog.core.models.api.ErrorResponse
import io.github.oshai.kotlinlogging.KotlinLogging
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.server.sessions.*

private val logger = KotlinLogging.logger {}

fun Route.adminRoutes() {
    route("/admin") {
        install(createRouteScopedPlugin("AdminAuth") {
            onCall { call ->
                if (call.sessions.get<AdminSession>() == null) {
                    call.respond(HttpStatusCode.Unauthorized, ErrorResponse("Not authenticated", -1))
                }
            }
        })

        get("/verify") {
            call.respond(HttpStatusCode.OK)
        }
    }
}
