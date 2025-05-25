import { NotFoundError } from '@/core/errors/not-found.js'

export class VerificationSessionNotFoundError extends NotFoundError {
	constructor() {
		super({
			title: 'Verification session not found.',
			details: '',
		})
	}
}
