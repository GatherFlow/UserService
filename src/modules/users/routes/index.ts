import type { Routes } from '@/core/types/routes.js'
import { changeUserLanguage, getUsers } from '../handlers/index.js'

export const getUsersRoutes = (): Routes => ({
	routes: [
		{
			method: 'GET',
			url: '/users',
			handler: getUsers,
		},
		{
			method: 'PUT',
			url: '/users/language',
			handler: changeUserLanguage,
		},
	],
})
