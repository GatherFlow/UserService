import {
	boolean,
	date,
	pgEnum,
	pgTable,
	text,
	varchar,
} from 'drizzle-orm/pg-core'
import { baseTableAttrs } from '../utils.js'
import { sql } from 'drizzle-orm'

export const roleEnum = pgEnum('role', ['user', 'admin', 'supervisor'])

export const userTable = pgTable('user', {
	...baseTableAttrs,
	username: varchar().unique().notNull(),
	firstName: varchar().notNull(),
	lastName: varchar().notNull(),
	bio: text().default(sql`NULL`),
	avatar: text().notNull(),
	role: roleEnum().notNull(),
	isVerified: boolean().notNull(),
	dateOfBirth: date({ mode: 'date' }).default(sql`NULL`),
})
