import { internalCredentialTable } from './schema/internalCredentials.js'
import { userTable } from './schema/users.js'

type User = typeof userTable.$inferSelect
type InternalCredentials = typeof internalCredentialTable.$inferInsert

type InternalUser = User & { email: string; password: string }

type PublicUser = Omit<User, 'id' | 'createdAt' | 'updatedAt'> & {
	email: string
}

export type { InternalCredentials, InternalUser, PublicUser, User }
