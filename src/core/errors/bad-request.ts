import { env } from '@/env.js'
import { HTTP_STATUS } from '../constants/index.js'
import { HttpError, type HttpErrorObj } from './http.js'

export class BadRequestError extends HttpError {
	constructor(args: Omit<HttpErrorObj, 'status' | 'type' | 'timestamp'>) {
		super({
			status: HTTP_STATUS.BAD_REQUEST,
			type: `${env.BASE_URL}/errors/bad-request`,
			...args,
		})
	}
}
