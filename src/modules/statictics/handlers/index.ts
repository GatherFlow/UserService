import type { FastifyReply, FastifyRequest } from 'fastify'

export const getTotalUsers = async (
	request: FastifyRequest,
	reply: FastifyReply,
): Promise<void> => {
	const { statisticsService } = request.diScope.cradle

	const count = await statisticsService.getTotalUsers()

	return reply.status(200).send({ count: count })
}
