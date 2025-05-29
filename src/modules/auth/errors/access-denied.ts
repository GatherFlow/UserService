import { UnauthorizedError } from '@/core/errors/unauthorized.js'

export class AccessDeniedError extends UnauthorizedError {
	constructor() {
		super({
			title: 'Access denied',
			details: 'You do not have permissions to perform this action',
		})
	}
}
