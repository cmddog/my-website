package com.cmddog.configuration

import com.cmddog.models.Commission
import com.cmddog.models.ErrorResponse
import com.cmddog.models.LoginRequest
import com.cmddog.services.PublicInfoService
import io.github.oshai.kotlinlogging.KotlinLogging
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.plugins.ratelimit.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.server.sessions.*
import org.ktorm.logging.Logger
import org.mindrot.jbcrypt.BCrypt
import org.slf4j.LoggerFactory
import java.util.*

private val logger = KotlinLogging.logger {  }

fun Application.configureRouting() {
    routing {
        val publicInfoService = PublicInfoService()

        route("/api") {
            // Public routes, rate limited
            rateLimit {
                get("/queue") {
                    call.respond(publicInfoService.getQueue())
                }

                // Admin login
                post("/admin/login") {
                    val pass = call.receive<LoginRequest>().password
                    val adminPassHash = System.getenv("ADMIN_PASS_HASH")

                    if (adminPassHash == null) {
                        call.respond(HttpStatusCode.InternalServerError)
                        logger.error { "Missing ADMIN_PASS_HASH environment variable." }
                        return@post
                    }

                    if (!BCrypt.checkpw(pass, adminPassHash)) {
                        call.respond(HttpStatusCode.Unauthorized, ErrorResponse("Incorrect Password"))
                        return@post
                    }

                    val session = AdminSession(UUID.randomUUID().toString())

                    call.sessions.set(session)
                    call.respond(HttpStatusCode.OK, session.sessionId)
                }
            }

            // Admin routes (session required)
            route("/admin") {
                install(createRouteScopedPlugin("AdminAuth") {
                    onCall { call ->
                        if (call.sessions.get<AdminSession>() == null) {
                            call.respond(HttpStatusCode.Unauthorized)
                            return@onCall
                        }
                    }
                })

                get("/commissions") {
//                call.respond(commissionService.getAllCommissions())
                }

                post("/commissions") {
                    val commission = call.receive<Commission>()
//                val id = commissionService.createCommission(commission)
//                call.respond(HttpStatusCode.Created, mapOf("id" to id))
                }
            }
        }
    }
}
