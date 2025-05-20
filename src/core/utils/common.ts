import type { FastifyReply } from 'fastify'
import type { ProblemDetails } from '../lib/problem.js'

const isProduction = (): boolean => process.env.NODE_ENV === 'production'

const throwHttpError = (reply: FastifyReply, error: ProblemDetails) => {
	return reply.status(error.status).send(error)
}

export { isProduction, throwHttpError }
