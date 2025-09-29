package com.example.configuration

import com.example.Commission
import com.example.CommissionService
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.plugins.ratelimit.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.server.sessions.*
import java.util.*

fun Application.configureRouting() {
    val commissionService = CommissionService()

    routing {
        // Rate-limited public routes
        route("/api") {
            rateLimit {
                get("/commissions") {
                    call.respond(commissionService.getAllCommissions())
                }
                get("/commissions/{id}") {
                    val id = call.parameters["id"]?.toIntOrNull()
                    if (id == null) {
                        call.respond(HttpStatusCode.BadRequest)
                        return@get
                    }
                    val commission = commissionService.getCommissionById(id)
                    if (commission != null) {
                        call.respond(commission)
                    } else {
                        call.respond(HttpStatusCode.NotFound)
                    }
                }
            }
        }

        // Admin login
        post("/admin/login") {
            val session = AdminSession(sessionId = UUID.randomUUID().toString())
            call.sessions.set(session)
            call.respond(HttpStatusCode.OK, mapOf("message" to "Logged in"))
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
                call.respond(commissionService.getAllCommissions())
            }
            post("/commissions") {
                val commission = call.receive<Commission>()
                val id = commissionService.createCommission(commission)
                call.respond(HttpStatusCode.Created, mapOf("id" to id))
            }
        }
    }
}
