import { BadRequestError } from '@/core/errors/bad-request.js'

export class InvalidCodeOrClientCredentialsError extends BadRequestError {
	constructor() {
		super({
			title: 'Invalid code or client credentials',
			details:
				'The authorization request failed because either the authorization code is invalid or the client credentials are incorrect.',
		})
	}
}
