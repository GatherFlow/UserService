import type { Routes } from '@/core/types/routes.js'
import { getAdminUsers } from '../handlers/index.js'

export const getAdminRoutes = (): Routes => ({
	routes: [
		{
			method: 'GET',
			url: '/admin/users',
			handler: getAdminUsers,
			schema: {
				tags: ['admin'],
			},
		},
	],
})
