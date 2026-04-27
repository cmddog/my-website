package com.cmddog.features.auth

import com.cmddog.core.AdminSession
import com.cmddog.core.GuestSession
import com.cmddog.core.UserSession
import com.cmddog.core.models.api.ErrorResponse
import com.cmddog.features.auth.models.api.IdentityType
import com.cmddog.features.auth.models.api.LoginRequest
import com.cmddog.features.auth.models.api.MeResponse
import com.cmddog.features.auth.models.api.RegisterRequest
import com.cmddog.features.user.UserService
import io.github.oshai.kotlinlogging.KotlinLogging
import io.ktor.http.*
import io.ktor.server.plugins.*
import io.ktor.server.plugins.ratelimit.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.server.sessions.*
import org.mindrot.jbcrypt.BCrypt
import java.util.*

private val logger = KotlinLogging.logger { }
private val adminUsernames = setOf("shiru")

fun Route.authRoutes() {
    route("/auth") {
        rateLimit(RateLimitName("auth")) {
            post("/login") {
                val req = call.receive<LoginRequest>()
                val user = UserService.getUserFromName(req.username.lowercase())

                if (user == null || !BCrypt.checkpw(req.password, user.passwordHash)) {
                    call.respond(HttpStatusCode.Unauthorized, ErrorResponse("Invalid credentials", -1))
                    return@post
                }

                val sessionId = UUID.randomUUID().toString()
                call.sessions.set(UserSession(user.username, sessionId))

                if (user.username in adminUsernames) {
                    val ip = call.request.headers["X-Forwarded-For"]
                        ?: call.request.origin.remoteHost
                    logger.info { "Login: ${user.username} from $ip" }

                    call.sessions.set(AdminSession(sessionId))
                }

                call.respond(HttpStatusCode.OK)
            }

            post("/register") {
                val req = call.receive<RegisterRequest>()
                val result = UserService.addUser(
                    req.username,
                    req.password,
                    req.securityQuestion,
                    req.securityAnswer
                )

                if (result === null) {
                    call.sessions.set(UserSession(req.username, UUID.randomUUID().toString()))
                    call.respond(HttpStatusCode.OK)
                } else {
                    call.respond(HttpStatusCode.BadRequest, result)
                }
            }
        }

        post("/logout") {
            call.sessions.clear<UserSession>()
            call.sessions.clear<AdminSession>()
            call.sessions.clear<GuestSession>()
            call.respond(HttpStatusCode.OK)
        }

        get("/me") {
            val userSession = call.sessions.get<UserSession>()
            val guestSession = call.sessions.get<GuestSession>()
            when {
                userSession != null -> {
                    val user = UserService.getUserFromName(userSession.username)
                    call.respond(MeResponse(IdentityType.USER, user?.displayName ?: userSession.username))
                }

                guestSession != null ->
                    call.respond(MeResponse(IdentityType.GUEST, "Guest #${guestSession.guestNumber}"))

                else ->
                    call.respond(MeResponse(IdentityType.ANONYMOUS, null))
            }
        }
    }
}
