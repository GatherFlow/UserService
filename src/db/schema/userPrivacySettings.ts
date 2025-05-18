import { boolean, pgTable, uuid } from 'drizzle-orm/pg-core'
import { baseTableAttrs } from '../utils.js'
import { userTable } from './users.js'

export const userPrivacyTable = pgTable('user_privacy_settings', {
	id: baseTableAttrs.id,
	isPrivate: boolean().notNull(),
	hideOwned: boolean().notNull(),
	hidePurchased: boolean().notNull(),
	hideAppreciated: boolean().notNull(),
	userId: uuid().references(() => userTable.id, {
		onDelete: 'cascade',
		onUpdate: 'cascade',
	}),
})
