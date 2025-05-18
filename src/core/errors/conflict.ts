import { env } from '@/env.js'
import { HTTP_STATUS } from '../constants/index.js'
import { HttpError, type HttpErrorObj } from './http.js'

export class ConflictError extends HttpError {
	constructor(args: Omit<HttpErrorObj, 'status' | 'type' | 'timestamp'>) {
		super({
			status: HTTP_STATUS.CONFICT,
			type: `${env.BASE_URL}/errors/conflict`,
			...args,
		})
	}
}
