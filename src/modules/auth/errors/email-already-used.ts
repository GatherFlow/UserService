import { ConflictError } from '@/core/errors/index.js'

export class EmailAlreadyUsedError extends ConflictError {
	constructor(email: string) {
		super({
			title: 'Email is already used',
			details: `Email ${email} is already used`,
		})
	}
}
