import { env } from '@/env.js'
import { HTTP_STATUS } from '../constants/index.js'
import { HttpError } from './http.js'

export class InternalServerError extends HttpError {
	constructor() {
		super({
			status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
			type: `${env.BASE_URL}/errors/internal-server-error`,
			title: 'Internal Server Error',
			details:
				'The server encountered an unexpected condition that prevented it from fulfilling the request.',
		})
	}
}
