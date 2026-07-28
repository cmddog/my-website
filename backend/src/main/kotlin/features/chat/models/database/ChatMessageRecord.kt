package com.cmddog.features.chat.models.database

import org.ktorm.entity.Entity
import org.ktorm.schema.*

interface ChatMessageRecord : Entity<ChatMessageRecord> {
    companion object : Entity.Factory<ChatMessageRecord>()
    val id: Long
    val sender: String
    val content: String
    val timestamp: Long
    val deleted: Boolean
}

object ChatMessages : Table<ChatMessageRecord>("chat_messages") {
    val id = long("id").primaryKey().bindTo { it.id }
    val sender = varchar("sender").bindTo { it.sender }
    val content = varchar("content").bindTo { it.content }
    val timestamp = long("timestamp").bindTo { it.timestamp }
    val deleted = boolean("deleted").bindTo { it.deleted }
}
