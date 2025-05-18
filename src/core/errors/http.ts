export interface HttpErrorObj {
	title: string
	type: string
	details: string
	status: number
	timestamp: string
}

export class HttpError extends Error {
	type: string
	status: number
	timestamp: string

	constructor({
		title,
		status,
		details,
		type,
	}: Omit<HttpErrorObj, 'timestamp'>) {
		super(`HttpError: ${status} ${details}`)

		this.type = type
		this.name = title
		this.message = details
		this.status = status
		this.timestamp = new Date().toISOString()
	}
}
