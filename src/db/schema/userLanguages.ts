import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core'
import { baseTableAttrs } from '../utils.js'
import { userTable } from './users.js'

export const userLanguageTable = pgTable('user_language', {
	id: baseTableAttrs.id,
	code: varchar({ length: 2 }).notNull(),
	userId: uuid()
		.notNull()
		.references(() => userTable.id, {
			onDelete: 'cascade',
			onUpdate: 'cascade',
		}),
})
