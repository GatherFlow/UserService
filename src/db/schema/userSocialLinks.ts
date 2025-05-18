import { check, pgTable, uuid, varchar } from 'drizzle-orm/pg-core'
import { baseTableAttrs } from '../utils.js'
import { userTable } from './users.js'
import { sql } from 'drizzle-orm'

export const userSocialLinkTable = pgTable(
	'user_social_link',
	{
		id: baseTableAttrs.id,
		url: varchar({ length: 2048 }).notNull(),
		userId: uuid()
			.notNull()
			.references(() => userTable.id),
	},
	(t) => [check('valid_url_check', sql`${t.url} ~* '^https?://'`)],
)
