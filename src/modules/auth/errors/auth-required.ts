import { UnauthorizedError } from '@/core/errors/unauthorized.js'

export class AuthRequiredError extends UnauthorizedError {
	constructor() {
		super({
			title: 'Authentification required',
			details: 'You must be authenticated to access this resource.',
		})
	}
}
