package com.cmddog

import org.ktorm.database.Database

object DatabaseSingleton {
    lateinit var commissions: Database private set
    lateinit var gallery: Database private set
    lateinit var miscellaneous: Database private set

    fun initialize(commissions: Database, gallery: Database, miscellaneous: Database) {
        this.commissions = commissions
        this.gallery = gallery
        this.miscellaneous = miscellaneous
    }
}
