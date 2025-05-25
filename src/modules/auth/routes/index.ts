import type { Routes } from '@/core/types/routes.js'
import {
	login,
	logout,
	me,
	sendVerificationEmailAgain,
	signup,
	verifyEmail,
} from '../handlers/index.js'
import { EMAIL_VERIFICATION_SCHEMA, LOGIN_SCHEMA } from '../schema/index.js'
import { CREATE_INTERNAL_USER_SCHEMA } from '@/modules/users/schemas/index.js'

export const getAuthRoutes = (): Routes => ({
	routes: [
		{
			method: 'POST',
			url: '/login',
			handler: login,
			schema: {
				body: LOGIN_SCHEMA,
			},
		},
		{
			method: 'POST',
			url: '/signup',
			handler: signup,
			schema: {
				body: CREATE_INTERNAL_USER_SCHEMA,
			},
		},
		{
			method: 'POST',
			url: '/verify-email',
			handler: verifyEmail,
			schema: {
				body: EMAIL_VERIFICATION_SCHEMA,
			},
		},
		{
			method: 'POST',
			url: '/resend-code',
			handler: sendVerificationEmailAgain,
		},
		{
			method: 'DELETE',
			url: '/logout',
			handler: logout,
		},
		{
			method: 'GET',
			url: '/me',
			handler: me,
		},
	],
})
