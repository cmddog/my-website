package com.cmddog.features.chat

import com.cmddog.core.GuestSession
import com.cmddog.core.UserSession
import com.cmddog.core.models.api.ErrorResponse
import com.cmddog.features.chat.models.api.ChatEvent
import com.cmddog.features.chat.models.api.ChatEventType
import com.cmddog.features.user.UserService
import io.ktor.http.*
import io.ktor.server.plugins.ratelimit.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.server.sessions.*
import io.ktor.server.sse.*
import io.ktor.sse.*
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json
import java.util.UUID
import kotlin.collections.isNotEmpty

private fun String.isSafeMessage() = isNotBlank() && length <= 500

@Serializable
data class SendMessageRequest(val content: String)

fun Route.chatRoutes() {
    route("/chat") {
        sse("/stream") {
            // Send history to this client immediately on connect
            val history = ChatService.getHistory()
            if (history.isNotEmpty()) {
                send(ServerSentEvent(
                    data = Json.encodeToString(
                        ChatEvent(ChatEventType.HISTORY, Json.encodeToString(history))
                    ),
                    event = "chat"
                ))
            }

            // Subscribe to broadcasts until the client disconnects
            ChatService.subscribe { event ->
                send(ServerSentEvent(
                    data = Json.encodeToString(event),
                    event = "chat"
                ))
            }
        }

        // Logged-in users
        rateLimit(RateLimitName("chat-user")) {
            post("/message") {
                val userSession = call.sessions.get<UserSession>()
                if (userSession == null) {
                    call.respond(HttpStatusCode.Unauthorized, ErrorResponse("Not logged in"))
                    return@post
                }

                val req = call.receive<SendMessageRequest>()
                if (!req.content.isSafeMessage()) {
                    call.respond(HttpStatusCode.BadRequest, ErrorResponse("Invalid message"))
                    return@post
                }

                val user = UserService.getUserFromName(userSession.username)
                val displayName = user?.displayName ?: userSession.username
                val msg = ChatService.addMessage(displayName, req.content)
                ChatService.broadcast(ChatEvent(ChatEventType.MESSAGE, Json.encodeToString(msg)))
                call.respond(HttpStatusCode.OK)
            }
        }

        // Guests
        rateLimit(RateLimitName("chat-guest")) {
            post("/message/guest") {
                val req = call.receive<SendMessageRequest>()
                if (!req.content.isSafeMessage()) {
                    call.respond(HttpStatusCode.BadRequest, ErrorResponse("Invalid message"))
                    return@post
                }

                val guestSession = call.sessions.get<GuestSession>()
                    ?: GuestSession(
                        guestNumber = (1000..9999).random(),
                        sessionId = UUID.randomUUID().toString()
                    ).also { call.sessions.set(it) }

                val msg = ChatService.addMessage("Guest #${guestSession.guestNumber}", req.content)
                ChatService.broadcast(ChatEvent(ChatEventType.MESSAGE, Json.encodeToString(msg)))
                call.respond(HttpStatusCode.OK)
            }
        }
    }
}
