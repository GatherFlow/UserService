import { ConflictError } from '@/core/errors/index.js'

export class UsernameAlreadyUsedError extends ConflictError {
	constructor(username: string) {
		super({
			title: 'Username is already used',
			details: `Username ${username} is already used`,
		})
	}
}
