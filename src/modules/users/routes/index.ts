import type { Routes } from '@/core/types/routes.js'
import { getUsers } from '../handlers/index.js'

export const getUsersRoutes = (): Routes => ({
	routes: [
		{
			method: 'GET',
			url: '/users',
			handler: getUsers,
		},
	],
})
