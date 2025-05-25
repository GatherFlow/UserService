import { BadRequestError } from '@/core/errors/bad-request.js'

export class ResetEmailNotVerified extends BadRequestError {
	constructor() {
		super({
			title: 'Email in not verified',
			details:
				'Email you entered is not verified, so password resetting cannot be completed',
		})
	}
}
