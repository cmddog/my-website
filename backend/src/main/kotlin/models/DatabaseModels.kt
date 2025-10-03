package com.cmddog.models

import kotlinx.serialization.Serializable
import org.ktorm.schema.*

object Clients : Table<Nothing>("clients") {
    val id = uuid("id")
    val name = varchar("name")
    val email = varchar("email")
}

object ClientOptionalInformation : Table<Nothing>("client_optional_information") {
    val id = uuid("id")
    val clientId = uuid("client_id")
    val type = varchar("type")
    val value = varchar("value")
}

object Commissions : Table<Nothing>("commissions") {
    val id = int("id")
    val clientId = uuid("client_id")
    val description = text("description")
    val price = decimal("price")
    val status = varchar("status")
    val createdAt = timestamp("created_at")
    val updatedAt = timestamp("updated_at")
}

object CommissionTypes : Table<Nothing>("commission_types") {
    val id = int("id")
    val commissionId = int("commission_id")
    val type = varchar("type")
}

object Queue : Table<Nothing>("queue") {
    val id = uuid("id")
    val commissionId = int("commission_id")
    val queuePosition = int("queue_position")
}

object Images : Table<Nothing>("images") {
    val id = int("id")
    val commissionId = int("commission_id")
    val filename = varchar("filename")
    val url = varchar("url")
    val uploadedAt = timestamp("uploaded_at")
}

@Serializable
data class Client(
    val id: String,
    val name: String,
    val email: String
)

@Serializable
data class Commission(
    val id: Int? = null,
    val clientId: String,
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
