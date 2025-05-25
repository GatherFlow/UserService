import { ConflictError } from '@/core/errors/conflict.js'

export class MissingVerificationTokenError extends ConflictError {
	constructor() {
		super({
			title: 'Missing verification token',
			details: 'Verification token for resending a code is missing',
		})
	}
}
