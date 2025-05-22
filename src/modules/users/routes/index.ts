import type { Routes } from '@/core/types/routes.js'
import {
	changeUserLanguage,
	getUsers,
	manageUserPrivacy,
} from '../handlers/index.js'
import {
	CHANGE_LANGUAGE_SCHEMA,
	MANAGE_PRIVACY_SCHEMA,
} from '../schemas/index.js'

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
			schema: {
				body: CHANGE_LANGUAGE_SCHEMA,
			},
		},
		{
			method: 'PUT',
			url: '/users/privacy',
			handler: manageUserPrivacy,
			schema: {
				body: MANAGE_PRIVACY_SCHEMA,
			},
		},
	],
})
