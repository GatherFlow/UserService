import type { InternalUser, PublicUser } from '@/db/types.js'

// TODO: Refactor to accept third-party users
export const toPublicUser = (user: InternalUser): PublicUser => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { createdAt, updatedAt, password, ...rest } = user

	return rest
}
