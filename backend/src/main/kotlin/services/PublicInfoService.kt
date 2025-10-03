package com.cmddog.services

import com.cmddog.DatabaseSingleton
import com.cmddog.models.*
import org.ktorm.dsl.*

class PublicInfoService {
    fun getQueue(): List<QueueItem> {
        val queueData = DatabaseSingleton.database.from(Queue)
            .innerJoin(Commissions, on = Queue.commissionId eq Commissions.id)
            .innerJoin(Clients, on = Commissions.clientId eq Clients.id)
            .select(Clients.name, Commissions.id, Commissions.status, Queue.queuePosition)
            .orderBy(Queue.queuePosition.asc())
            .map { row ->
                QueueKey(
                    clientName = row[Clients.name]!!,
                    commissionId = row[Commissions.id]!!,
                    status = row[Commissions.status]!!,
                    position = row[Queue.queuePosition]!!
                )
            }

        return queueData.map { (clientName, commissionId, status, position) ->
            val types = DatabaseSingleton.database.from(CommissionTypes)
                .select(CommissionTypes.type)
                .where { CommissionTypes.commissionId eq commissionId }
                .map { it[CommissionTypes.type]!! }

            QueueItem(
                clientName = clientName,
                commissionTypes = types,
                status = status,
                position = position
            )
        }
    }
}

data class QueueKey (
    val clientName: String,
    val commissionId: Int,
    val status: String,
    val position: Int
)
