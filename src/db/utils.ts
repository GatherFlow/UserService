import { sql } from 'drizzle-orm'
import { timestamp, uuid } from 'drizzle-orm/pg-core'

const baseTableAttrs = {
	id: uuid()
		.primaryKey()
		.default(sql`uuid_generate_v7()`),
	createdAt: timestamp({ withTimezone: true, mode: 'date' })
		.notNull()
		.defaultNow(),
	updatedAt: timestamp({ withTimezone: true, mode: 'date' })
		.notNull()
		.defaultNow()
		.$onUpdateFn(() => new Date()),
}

export { baseTableAttrs }
