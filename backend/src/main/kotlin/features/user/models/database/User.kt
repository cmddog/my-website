package com.cmddog.features.user.models.database

import org.ktorm.entity.Entity
import org.ktorm.schema.Table
import org.ktorm.schema.date
import org.ktorm.schema.int
import org.ktorm.schema.varchar
import java.time.LocalDate

interface User : Entity<User> {
    companion object : Entity.Factory<User>()
    val username: String
    val displayName: String
    val passwordHash: String
    val bio: String
    val profilePicture: String
    val messagesSent: Int
    val created: LocalDate
    val lastSeen: LocalDate
}

object Users : Table<User>("users") {
    val username = varchar("username").primaryKey().bindTo { it.username }
    val display_name = varchar("display_name").bindTo { it.displayName }
    val password_hash = varchar("password_hash").bindTo { it.passwordHash }
    val bio = varchar("bio").bindTo { it.bio }
    val profile_picture = varchar("profile_picture").bindTo { it.profilePicture }
    val messages_sent = int("messages_sent").bindTo { it.messagesSent }
    val created = date("created").bindTo { it.created }
    val last_seen = date("last_seen").bindTo { it.lastSeen }
}
