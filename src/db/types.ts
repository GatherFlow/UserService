import { internalCredentialTable } from './schema/internalCredentials.js'
import type { passwordResetSessionTable } from './schema/passwordResetSessions.js'
import { userPrivacyTable } from './schema/userPrivacySettings.js'
import { userTable } from './schema/users.js'

type Role = 'admin' | 'supervisor' | 'user'
type Language = 'en' | 'uk'

type User = typeof userTable.$inferSelect
type InternalCredentials = typeof internalCredentialTable.$inferSelect
type UserPrivacy = Omit<typeof userPrivacyTable.$inferSelect, 'id' | 'userId'>
type PasswordResetSession = typeof passwordResetSessionTable.$inferSelect

interface UserLanguage {
	language: string
}

type InternalUser = User & { email: string; password: string }
type ExternalUser = User & { email: string; providerId: string }

type PublicUser = Omit<User, 'createdAt' | 'updatedAt'> & {
	email: string
	language: string
}

export type {
	ExternalUser,
	InternalCredentials,
	InternalUser,
	Language,
	PasswordResetSession,
	PublicUser,
	Role,
	User,
	UserLanguage,
	UserPrivacy,
}
