package com.cmddog.configuration

import com.cmddog.DatabaseSingleton
import com.cmddog.models.ErrorResponse
import com.cmddog.models.LoginRequest
import com.cmddog.services.UserService
import io.github.oshai.kotlinlogging.KotlinLogging
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.plugins.origin
import io.ktor.server.plugins.ratelimit.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.server.sessions.*
import org.mindrot.jbcrypt.BCrypt
import java.util.*

private val logger = KotlinLogging.logger { }

fun Application.configureRouting() {
    routing {
//        val publicInfoService = PublicInfoService()

        route("/api") {
            // Public routes, rate limited
            rateLimit {
                // Admin login
                post("/admin/login") {
                    val pass = call.receive<LoginRequest>().password
                    val passHash = UserService.getUserFromName("shiru")?.passwordHash

                    if (passHash == null) {
                        logger.error { "Attempted to log into admin, but got null for password hash." }
                        call.respond(HttpStatusCode.InternalServerError)
                        return@post
                    }

                    if (!BCrypt.checkpw(pass, passHash)) {
                        call.respond(HttpStatusCode.Unauthorized, ErrorResponse("Incorrect Password"))
                        return@post
                    }

                    val session = AdminSession(UUID.randomUUID().toString())

                    val ip = call.request.headers["X-Forwarded-For"]
                        ?: call.request.origin.remoteHost

                    logger.info { "Successful admin login from $ip" }
                    call.sessions.set(session)
                    call.respond(HttpStatusCode.OK)
                }
            }

            // Admin routes (session required)
            route("/admin") {
                install(createRouteScopedPlugin("AdminAuth") {
                    onCall { call ->
                        if (call.sessions.get<AdminSession>() == null) {
                            call.respond(HttpStatusCode.Unauthorized, ErrorResponse("Not authenticated"))
                            return@onCall
                        }
                    }
                })

                get("/verify") {
                    // AdminAuth takes care of verification. Getting here means the user is logged in
                    call.respond(HttpStatusCode.OK)
                }

                post("/logout") {
                    call.sessions.clear<AdminSession>()
                    call.respond(HttpStatusCode.OK)
                }
            }
        }
    }
}
