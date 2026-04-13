package com.cmddog.features.user

import com.cmddog.core.DatabaseSingleton
import com.cmddog.features.user.models.database.User
import com.cmddog.features.user.models.database.Users
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
