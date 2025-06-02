import type { Routes } from '@/core/types/routes.js'
import {
	changeUserLanguage,
	editUserProfile,
	getManyUsers,
	getUserPrivacy,
	manageUserPrivacy,
} from '../handlers/index.js'
import {
	CHANGE_LANGUAGE_SCHEMA,
	EDIT_USER_PROFILE_SCHEMA,
	GET_MANY_USERS_SCHEMA,
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
				tags: ['profile'],
			},
		},
		{
			method: 'GET',
			url: '/users/privacy',
			handler: getUserPrivacy,
			schema: {
				tags: ['profile'],
			},
		},
		{
			method: 'PUT',
			url: '/users/privacy',
			handler: manageUserPrivacy,
			schema: {
				body: MANAGE_PRIVACY_SCHEMA,
				tags: ['profile'],
			},
		},
		{
			method: 'PUT',
			url: '/users/profile',
			handler: editUserProfile,
			schema: {
				body: EDIT_USER_PROFILE_SCHEMA,
				tags: ['profile'],
			},
		},
		{
			method: 'GET',
			url: '/users/many',
			handler: getManyUsers,
			schema: {
				querystring: GET_MANY_USERS_SCHEMA,
				tags: ['users'],
			},
		},
	],
})
