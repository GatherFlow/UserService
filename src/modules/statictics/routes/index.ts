import type { Routes } from '@/core/types/routes.js'
import { getTotalUsers } from '../handlers/index.js'

export const getStatisticsRoutes = (): Routes => ({
	routes: [
		{
			method: 'GET',
			url: '/statistics/total-users',
			handler: getTotalUsers,
			schema: {
				tags: ['statistics'],
			},
		},
	],
})
