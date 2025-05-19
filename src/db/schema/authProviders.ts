import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core'
import { baseTableAttrs } from '../utils.js'
import { userTable } from './users.js'

export const authProviderTable = pgTable('auth_provider', {
	id: baseTableAttrs.id,
	createdAt: baseTableAttrs.createdAt,
	provider: varchar().notNull(),
	providerUserId: varchar().notNull(),
	userId: uuid()
		.notNull()
		.references(() => userTable.id, {
			onDelete: 'cascade',
			onUpdate: 'cascade',
		}),
})
