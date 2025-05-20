import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core'
import { baseTableAttrs } from '../utils.js'
import { userTable } from './users.js'

export const authProviderTable = pgTable('auth_provider', {
	id: baseTableAttrs.id,
	createdAt: baseTableAttrs.createdAt,
	email: varchar().notNull(),
	provider: varchar().notNull(),
	providerUserId: varchar().notNull(),
	userId: uuid()
		.notNull()
		.references(() => userTable.id, {
			onDelete: 'cascade',
			onUpdate: 'cascade',
		}),
})
