package com.cmddog.configuration

import com.zaxxer.hikari.HikariConfig
import com.zaxxer.hikari.HikariDataSource
import io.ktor.server.application.*
import org.flywaydb.core.Flyway
import org.ktorm.database.Database

fun Application.configureDatabase(name: String): Database {
    val config = HikariConfig().apply {
        driverClassName = "org.postgresql.Driver"
        jdbcUrl = System.getenv("${name.uppercase()}_DATABASE_URL")
            ?: "jdbc:postgresql://localhost:5432/$name"
        username = "postgres"
        password = "postgres"
        maximumPoolSize = 3
    }

    val dataSource = HikariDataSource(config)

    Flyway.configure()
        .dataSource(dataSource)
        .locations("classpath:db/migration/$name")
        .load()
        .migrate()

    return Database.connect(dataSource)
}
