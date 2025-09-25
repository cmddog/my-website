package com.example

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.plugins.ratelimit.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

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

        // Admin routes (no rate limiting)
        route("/admin") {
            get("/commissions") {
                call.respond(commissionService.getAllCommissions())
            }
            post("/commissions") {
                val commission = call.receive<Commission>()
                val id = commissionService.createCommission(commission)
                call.respond(HttpStatusCode.Created, mapOf("id" to id))
            }
            delete("/commissions/{id}") {
                val id = call.parameters["id"]?.toIntOrNull()
                if (id == null) {
                    call.respond(HttpStatusCode.BadRequest)
                    return@delete
                }
                if (commissionService.deleteCommission(id)) {
                    call.respond(HttpStatusCode.NoContent)
                } else {
                    call.respond(HttpStatusCode.NotFound)
                }
            }
        }

        get("/") {
            call.respondText("Commission Website API")
        }
    }
}