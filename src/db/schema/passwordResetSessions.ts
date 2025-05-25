import { boolean, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'
import { baseTableAttrs } from '../utils.js'
import { userTable } from './users.js'

export const passwordResetSessionTable = pgTable('password-reset-session', {
	id: baseTableAttrs.id,
	expiresAt: timestamp({ withTimezone: true, mode: 'date' }).notNull(),
	email: varchar().notNull(),
	code: varchar({ length: 4 }).notNull(),
	isEmailVerified: boolean().notNull().default(false),
	userId: uuid()
		.notNull()
		.references(() => userTable.id, {
			onDelete: 'cascade',
			onUpdate: 'cascade',
		}),
})
