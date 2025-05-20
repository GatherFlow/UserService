import { UnauthorizedError } from '@/core/errors/index.js'

export class InvalidCredentialsError extends UnauthorizedError {
	constructor() {
		super({
			title: 'Invalid email or password',
			details:
				'Your login attempt was unsuccessful because the email address or password you entered is incorrect.',
		})
	}
}
