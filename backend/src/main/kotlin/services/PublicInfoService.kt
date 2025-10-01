package com.cmddog.services

import com.cmddog.DatabaseSingleton
import com.cmddog.models.*
import org.ktorm.dsl.*

class PublicInfoService {
    fun getQueue(): List<QueueInfo> {
        return DatabaseSingleton.database.from(Queue)
            .innerJoin(Commissions, on = Queue.commissionId eq Commissions.id)
            .innerJoin(Clients, on = Commissions.clientId eq Clients.id)
            .select(Clients.name, Commissions.type, Commissions.status, Queue.queuePosition)
            .orderBy(Queue.queuePosition.asc())
            .map { row ->
                QueueInfo(
                    clientName = row[Clients.name]!!,
                    type = row[Commissions.type]!!,
                    status = row[Commissions.status]!!,
                    position = row[Queue.queuePosition]!!
                )
            }
    }
}
