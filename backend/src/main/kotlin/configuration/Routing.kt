package com.cmddog.configuration

import com.cmddog.models.Commission
import com.cmddog.services.PublicInfoService
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.plugins.ratelimit.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.server.sessions.*
import java.util.*

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
                    val session = AdminSession(sessionId = UUID.randomUUID().toString())
                    call.sessions.set(session)
                    call.respond(HttpStatusCode.OK)
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
