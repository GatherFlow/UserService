import type { Routes } from '@/core/types/routes.js'
import {
	googleAuthRedirect,
	validateGoogleCallback,
} from '../handlers/index.js'
import { VALIDATE_GOOGLE_CALLBACK_SCHEMA } from '../schemas/index.js'

export const oauthRoutes = (): Routes => ({
	routes: [
		{
			method: 'GET',
			url: '/oauth/google',
			handler: googleAuthRedirect,
			schema: {
				tags: ['oauth'],
			},
		},
		{
			method: 'GET',
			url: '/oauth/google/callback',
			handler: validateGoogleCallback,
			schema: {
				querystring: VALIDATE_GOOGLE_CALLBACK_SCHEMA,
				tags: ['oauth'],
			},
		},
	],
})
