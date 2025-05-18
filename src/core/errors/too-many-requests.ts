import { env } from '@/env.js'
import { HTTP_STATUS } from '../constants/index.js'
import { HttpError } from './http.js'

export class TooManyRequestsError extends HttpError {
	constructor() {
		super({
			status: HTTP_STATUS.TOO_MANY_REQUESTS,
			type: `${env.BASE_URL}/errors/too-many-requests`,
			title: 'Too Many Requests',
			details:
				'You have exceeded the allowed number of requests. Please slow down and try again later.',
		})
	}
}
