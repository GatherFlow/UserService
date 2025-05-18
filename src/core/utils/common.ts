import type { FastifyReply } from 'fastify'
import type { ProblemDetails } from '../lib/problem.js'

export const throwHttpError = (reply: FastifyReply, error: ProblemDetails) => {
	return reply.status(error.status).send(error)
}
