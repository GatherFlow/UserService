import type { HttpError } from '../errors/index.js'

interface ProblemDetails {
	type: string
	title: string
	status: number
	details?: string
	instance?: string
}

class Problem {
	static from(error: HttpError): ProblemDetails {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { stack, cause, name: title, message: details, ...rest } = error

		return {
			title,
			details,
			...rest,
		}
	}

	static withInstance(
		problem: ProblemDetails,
		instance: string,
	): ProblemDetails {
		return { ...problem, instance }
	}
}

export { Problem }
export type { ProblemDetails }
