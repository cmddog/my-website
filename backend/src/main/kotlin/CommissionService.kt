package com.example

import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.transaction

class CommissionService {

    fun getAllCommissions(): List<Commission> = transaction {
        Commissions.selectAll().map { row ->
            Commission(
                id = row[Commissions.id].value,
                title = row[Commissions.title],
                description = row[Commissions.description],
                price = row[Commissions.price].toString(),
                status = row[Commissions.status]
            )
        }
    }

    fun createCommission(commission: Commission): Int = transaction {
        Commissions.insert {
            it[title] = commission.title
            it[description] = commission.description
            it[price] = commission.price.toBigDecimal()
            it[status] = commission.status
        }[Commissions.id].value
    }

    fun getCommissionById(id: Int): Commission? = transaction {
        Commissions.select { Commissions.id eq id }
            .singleOrNull()?.let { row ->
                Commission(
                    id = row[Commissions.id].value,
                    title = row[Commissions.title],
                    description = row[Commissions.description],
                    price = row[Commissions.price].toString(),
                    status = row[Commissions.status]
                )
            }
    }
}
