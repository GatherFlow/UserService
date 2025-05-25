import { ConflictError } from '@/core/errors/conflict.js'

export class MissingResetTokenError extends ConflictError {
	constructor() {
		super({
			title: 'Missing reset token',
			details: 'Token for resetting a password is missing',
		})
	}
}
