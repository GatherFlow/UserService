import type { Routes } from '@/core/types/routes.js'
import {
	login,
	logout,
	me,
	requestPasswordReset,
	resetPassword,
	sendVerificationEmailAgain,
	signup,
	verifyEmail,
	verifyResetEmail,
} from '../handlers/index.js'
import {
	EMAIL_VERIFICATION_SCHEMA,
	LOGIN_SCHEMA,
	PASSWORD_RESET_SCHEMA,
	REQUEST_PASSWORD_RESET_SCHEMA,
} from '../schema/index.js'
import { CREATE_INTERNAL_USER_SCHEMA } from '@/modules/users/schemas/index.js'

export const getAuthRoutes = (): Routes => ({
	routes: [
		{
			method: 'POST',
			url: '/login',
			handler: login,
			schema: {
				body: LOGIN_SCHEMA,
				tags: ['auth'],
			},
		},
		{
			method: 'POST',
			url: '/signup',
			handler: signup,
			schema: {
				body: CREATE_INTERNAL_USER_SCHEMA,
				tags: ['auth'],
			},
		},
		{
			method: 'POST',
			url: '/verify-email',
			handler: verifyEmail,
			schema: {
				body: EMAIL_VERIFICATION_SCHEMA,
				tags: ['auth'],
			},
		},
		{
			method: 'POST',
			url: '/resend-code',
			handler: sendVerificationEmailAgain,
			schema: {
				tags: ['auth'],
			},
		},
		{
			method: 'POST',
			url: '/request-password-reset',
			handler: requestPasswordReset,
			schema: {
				body: REQUEST_PASSWORD_RESET_SCHEMA,
				tags: ['auth'],
			},
		},
		{
			method: 'POST',
			url: '/verify-reset-email',
			handler: verifyResetEmail,
			schema: {
				body: EMAIL_VERIFICATION_SCHEMA,
				tags: ['auth'],
			},
		},
		{
			method: 'PUT',
			url: '/reset-password',
			handler: resetPassword,
			schema: {
				body: PASSWORD_RESET_SCHEMA,
				tags: ['auth'],
			},
		},
		{
			method: 'DELETE',
			url: '/logout',
			handler: logout,
			schema: {
				tags: ['auth'],
			},
		},
		{
			method: 'GET',
			url: '/me',
			handler: me,
			schema: {
				tags: ['auth'],
			},
		},
	],
})
