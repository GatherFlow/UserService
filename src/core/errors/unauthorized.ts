import { env } from '@/env.js'
import { HTTP_STATUS } from '../constants/index.js'
import { HttpError, type HttpErrorObj } from './http.js'

export class UnauthorizedError extends HttpError {
	constructor(args: Omit<HttpErrorObj, 'status' | 'type' | 'timestamp'>) {
		super({
			status: HTTP_STATUS.UNAUTHRIZED,
			type: `${env.BASE_URL}/errors/unauthorized`,
			...args,
		})
	}
}
