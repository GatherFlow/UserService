import { UnauthorizedError } from '@/core/errors/unauthorized.js'

export class InvalidEmailError extends UnauthorizedError {
	constructor() {
		super({
			title: 'Invalid email',
			details:
				'Your reset password attempt was unsuccessful because the email address you entered is incorrect.',
		})
	}
}
