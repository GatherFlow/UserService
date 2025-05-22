import { protectedRoute } from '@/core/guards/index.js'
import type { FastifyReply, FastifyRequest } from 'fastify'
import type {
	CHANGE_LANGUAGE_TYPE,
	EDIT_USER_PROFILE_TYPE,
	MANAGE_PRIVACY_TYPE,
} from '../schemas/index.js'
import { Problem } from '@/core/lib/problem.js'
import { UsernameAlreadyUsedError } from '@/modules/auth/errors/username-already-used.js'
import { throwHttpError } from '@/core/utils/common.js'

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

export const manageUserPrivacy = protectedRoute<{ Body: MANAGE_PRIVACY_TYPE }>(
	async (request, reply) => {
		const { id } = request.user
		const { usersRepository } = request.diScope.cradle

		await usersRepository.managePrivacy(id, request.body)

		return reply.status(204).send()
	},
)

export const getUserPrivacy = protectedRoute(async (request, reply) => {
	const { id } = request.user
	const { usersRepository } = request.diScope.cradle

	const privacy = await usersRepository.getUserPrivacy(id)

	return reply.status(200).send(privacy)
})

export const editUserProfile = protectedRoute<{ Body: EDIT_USER_PROFILE_TYPE }>(
	async (request, reply) => {
		const { id } = request.user
		const { usersRepository } = request.diScope.cradle

		const isUsernameAvailable = await usersRepository.isUsernameAvailable(
			request.body.username,
		)

		if (!isUsernameAvailable) {
			const problem = Problem.withInstance(
				Problem.from(new UsernameAlreadyUsedError(request.body.username)),
				request.url,
			)

			return throwHttpError(reply, problem)
		}

		await usersRepository.editProfile(id, request.body)

		return reply.status(204).send()
	},
)
