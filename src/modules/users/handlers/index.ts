import type { FastifyReply, FastifyRequest } from 'fastify'
import type { CHANGE_LANGUAGE_TYPE } from '../schemas/index.js'
import { protectedRoute } from '@/core/guards/index.js'

export const getUsers = async (
	request: FastifyRequest,
	reply: FastifyReply,
): Promise<void> => {
	const { usersRepository } = request.diScope.cradle

	const users = await usersRepository.findAll()

	return reply.status(200).send(users)
}

export const changeUserLanguage = protectedRoute<{
	Body: CHANGE_LANGUAGE_TYPE
}>(async (request, reply) => {
	const { id } = request.user
	const { language } = request.body
	const { usersRepository } = request.diScope.cradle

	if (request.user.language === language) {
		return reply.status(204).send()
	}

	await usersRepository.changeLanguage(id, language)

	return reply.status(204).send()
})
