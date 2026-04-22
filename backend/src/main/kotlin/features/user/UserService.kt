package com.cmddog.features.user

import com.cmddog.core.DatabaseSingleton
import com.cmddog.core.models.api.ErrorResponse
import com.cmddog.features.user.models.database.User
import com.cmddog.features.user.models.database.Users
import org.ktorm.dsl.eq
import org.ktorm.dsl.insert
import org.ktorm.entity.find
import org.ktorm.entity.sequenceOf
import org.mindrot.jbcrypt.BCrypt

object UserService {
    fun getUserFromName(username: String): User? {
        return DatabaseSingleton.miscellaneous
            .sequenceOf(Users)
            .find { Users.username eq username.lowercase() }
    }

    fun addUser(
        username: String,
        password: String,
        securityQuestion: String,
        securityAnswer: String
    ): ErrorResponse? {
        if (username.isBlank() || username.length > 32 || Regex("([A-z]|[0-9])+").matches(username))
        if (getUserFromName(username) !== null) return ErrorResponse("Username already taken")
        if (password.length < 10) return ErrorResponse("Password must be at least 10 characters long")

        DatabaseSingleton.miscellaneous.insert(Users) {
            set(it.username, username)
            set(it.display_name, username)
            set(it.password_hash, BCrypt.hashpw(password, BCrypt.gensalt()))
            set(it.security_question, securityQuestion)
            set(it.security_answer, securityAnswer)
        }
        return null
    }
}
