import { internalCredentialTable } from './schema/internalCredentials.js'
import { userPrivacyTable } from './schema/userPrivacySettings.js'
import { userTable } from './schema/users.js'

type Language = 'en' | 'uk'

type User = typeof userTable.$inferSelect
type InternalCredentials = typeof internalCredentialTable.$inferSelect
type UserPrivacy = Omit<typeof userPrivacyTable.$inferSelect, 'id' | 'userId'>

interface UserLanguage {
	language: string
}

type InternalUser = User & { email: string; password: string }

type PublicUser = Omit<User, 'createdAt' | 'updatedAt'> & {
	email: string
	language: string
}

export type {
	InternalCredentials,
	InternalUser,
	Language,
	PublicUser,
	User,
	UserLanguage,
	UserPrivacy,
}
