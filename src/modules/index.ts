import type { Routes } from '@/core/types/routes.js'
import { getUsersRoutes } from './users/routes/index.js'
import { getAuthRoutes } from './auth/routes/index.js'
import { getOAuthRoutes } from './oauth/routes/index.js'
import { getAdminRoutes } from './admin/routes/index.js'

export const getRoutes = (): Routes => {
	const { routes: usersRoutes } = getUsersRoutes()
	const { routes: authRoutes } = getAuthRoutes()
	const { routes: oauthRoutes } = getOAuthRoutes()
	const { routes: adminRoutes } = getAdminRoutes()

	return {
		routes: [
			{
				method: 'GET',
				url: '/health',
				handler: (request, reply) => {
					const data = {
						uptime: process.uptime(),
						message: request.i18n.t('status'),
						date: new Date(),
					}

					return reply.status(200).send(data)
				},
			},
			...authRoutes,
			...usersRoutes,
			...oauthRoutes,
			...adminRoutes,
		],
	}
}
