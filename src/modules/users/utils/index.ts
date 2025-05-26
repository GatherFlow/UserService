import type {
	ExternalUser,
	InternalUser,
	PublicUser,
	UserLanguage,
} from '@/db/types.js'

// TODO: Refactor to accept third-party users
export const toPublicUser = (
	user: (InternalUser | ExternalUser) & UserLanguage,
): PublicUser => {
	if ('password' in user) {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { createdAt, updatedAt, password, ...rest } = user

		return { ...rest }
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { createdAt, updatedAt, providerId, ...rest } = user

	return { ...rest }
}
