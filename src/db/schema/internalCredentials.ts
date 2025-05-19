import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core'
import { baseTableAttrs } from '../utils.js'
import { userTable } from './users.js'

export const internalCredentialTable = pgTable('internal_credential', {
	id: baseTableAttrs.id,
	createdAt: baseTableAttrs.createdAt,
	email: varchar().notNull().unique(),
	passwordHash: varchar().notNull(),
	userId: uuid()
		.notNull()
		.references(() => userTable.id, {
			onDelete: 'cascade',
			onUpdate: 'cascade',
		}),
})
