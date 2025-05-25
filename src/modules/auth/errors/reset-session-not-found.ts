import { NotFoundError } from '@/core/errors/not-found.js'

export class ResetSessionNotFound extends NotFoundError {
	constructor() {
		super({
			title: 'Reset session not found.',
			details: '',
		})
	}
}
