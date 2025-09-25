package com.example

import kotlinx.serialization.Serializable
import org.jetbrains.exposed.dao.id.IntIdTable
import org.jetbrains.exposed.sql.javatime.datetime
import java.time.LocalDateTime

object Commissions : IntIdTable() {
    val title = varchar("title", 255)
    val description = text("description")
    val price = decimal("price", 10, 2)
    val status = varchar("status", 50).default("pending")
}

object Images : IntIdTable() {
    val commissionId = reference("commission_id", Commissions)
    val filename = varchar("filename", 255)
    val url = varchar("url", 500)
    val uploadedAt = datetime("uploaded_at").default(LocalDateTime.now())
}

@Serializable
data class Commission(
    val id: Int? = null,
    val title: String,
    val description: String,
    val price: String,
    val status: String = "pending"
)

@Serializable
data class Image(
    val id: Int? = null,
    val commissionId: Int,
    val filename: String,
    val url: String
)
