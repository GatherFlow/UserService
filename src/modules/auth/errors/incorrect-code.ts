import { BadRequestError } from '@/core/errors/bad-request.js'

export class IncorrectCode extends BadRequestError {
	constructor(code: string) {
		super({
			title: 'Incorrect code',
			details: `Code ${code} is incorrect`,
		})
	}
}
