import type { Routes } from '@/core/types/routes.js'
import {
	deleteAdminUser,
	editAdminUser,
	getAdminUsers,
} from '../handlers/index.js'
import { GET_USER_PARAMS_SCHEMA } from '../schemas/index.js'
import { EDIT_USER_PROFILE_SCHEMA } from '@/modules/users/schemas/index.js'

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
		{
			method: 'PUT',
			url: '/admin/users/:id/profile',
			handler: editAdminUser,
			schema: {
				params: GET_USER_PARAMS_SCHEMA,
				body: EDIT_USER_PROFILE_SCHEMA,
				tags: ['admin'],
			},
		},
		{
			method: 'DELETE',
			url: '/admin/users/:id',
			handler: deleteAdminUser,
			schema: {
				params: GET_USER_PARAMS_SCHEMA,
				tags: ['admin'],
			},
		},
	],
})
