import type { Routes } from '@/core/types/routes.js'
import {
	changeUserLanguage,
	editUserProfile,
	getUserPrivacy,
	manageUserPrivacy,
} from '../handlers/index.js'
import {
	CHANGE_LANGUAGE_SCHEMA,
	EDIT_USER_PROFILE_SCHEMA,
	MANAGE_PRIVACY_SCHEMA,
} from '../schemas/index.js'

export const getUsersRoutes = (): Routes => ({
	routes: [
		{
			method: 'PUT',
			url: '/users/language',
			handler: changeUserLanguage,
			schema: {
				body: CHANGE_LANGUAGE_SCHEMA,
			},
		},
		{
			method: 'GET',
			url: '/users/privacy',
			handler: getUserPrivacy,
		},
		{
			method: 'PUT',
			url: '/users/privacy',
			handler: manageUserPrivacy,
			schema: {
				body: MANAGE_PRIVACY_SCHEMA,
			},
		},
		{
			method: 'PUT',
			url: '/users/profile',
			handler: editUserProfile,
			schema: {
				body: EDIT_USER_PROFILE_SCHEMA,
			},
		},
	],
})
