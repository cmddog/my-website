package com.example.configuration

import com.zaxxer.hikari.HikariConfig
import com.zaxxer.hikari.HikariDataSource
import io.ktor.server.application.*
import org.flywaydb.core.Flyway
import org.jetbrains.exposed.sql.*

fun Application.configureDatabase() {
    val config = HikariConfig().apply {
        driverClassName = "org.postgresql.Driver"
        jdbcUrl = System.getenv("DATABASE_URL") ?: "jdbc:postgresql://localhost:5432/commissions"
        username = System.getenv("DATABASE_USER") ?: "postgres"
        password = System.getenv("DATABASE_PASSWORD") ?: "postgres"
        maximumPoolSize = 3
    }

    val dataSource = HikariDataSource(config)

    // Run Flyway migrations
    val flyway = Flyway.configure()
        .dataSource(dataSource)
        .load()
    flyway.migrate()

    Database.connect(dataSource)
}
