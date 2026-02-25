package com.cmddog

import org.ktorm.database.Database

object DatabaseSingleton {
    lateinit var database: Database private set

    fun initialize(database: Database) {
        this.database = database
    }
}
