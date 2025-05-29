import type { PublicUser } from '@/db/types.js'

export const isAdmin = (user: PublicUser) => {
	return user.role === 'supervisor' || user.role === 'admin'
}
