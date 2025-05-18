import { date, pgEnum, pgTable, text, varchar } from 'drizzle-orm/pg-core'
import { baseTableAttrs } from '../utils.js'
import { sql } from 'drizzle-orm'

export const roleEnum = pgEnum('role', ['user', 'admin'])

export const userTable = pgTable('user', {
	...baseTableAttrs,
	firstName: varchar().unique().notNull(),
	lastName: varchar().unique().notNull(),
	avatar: text().notNull(),
	dateOfBirth: date({ mode: 'date' }).default(sql`NULL`),
})
