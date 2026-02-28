package com.cmddog.services

import com.cmddog.DatabaseSingleton
import models.User
import models.Users
import org.ktorm.dsl.eq
import org.ktorm.entity.find
import org.ktorm.entity.sequenceOf

object UserService {
    fun getUserFromName(username: String): User? {
        return DatabaseSingleton.miscellaneous
            .sequenceOf(Users)
            .find { Users.username eq username.lowercase() }
    }
}
