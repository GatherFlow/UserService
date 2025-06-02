import { protectedRoute } from '@/core/guards/index.js'
import type {
	CHANGE_LANGUAGE_TYPE,
	EDIT_USER_PROFILE_TYPE,
	GET_MANY_USERS_TYPE,
	MANAGE_PRIVACY_TYPE,
} from '../schemas/index.js'

export const changeUserLanguage = protectedRoute<{
	Body: CHANGE_LANGUAGE_TYPE
}>(async (request, reply) => {
	const { id } = request.user
	const { language } = request.body
	const { profilesRepository } = request.diScope.cradle

	if (request.user.language === language) {
		return reply.status(204).send()
	}

	await profilesRepository.changeLanguage(id, language)

	return reply.status(204).send()
})

export const manageUserPrivacy = protectedRoute<{ Body: MANAGE_PRIVACY_TYPE }>(
	async (request, reply) => {
		const { id } = request.user
		const { profilesRepository } = request.diScope.cradle

		await profilesRepository.managePrivacy(id, request.body)

		return reply.status(204).send()
	},
)

export const getUserPrivacy = protectedRoute(async (request, reply) => {
	const { id } = request.user
	const { profilesRepository } = request.diScope.cradle

	const privacy = await profilesRepository.getPrivacy(id)

	return reply.status(200).send(privacy)
})

export const editUserProfile = protectedRoute<{ Body: EDIT_USER_PROFILE_TYPE }>(
	async (request, reply) => {
		const { id } = request.user
		const { profilesRepository } = request.diScope.cradle

		await profilesRepository.editProfile(id, request.body)

		return reply.status(204).send()
	},
)

export const getManyUsers = protectedRoute<{
	Querystring: GET_MANY_USERS_TYPE
}>(async (request, reply) => {
	const { ids } = request.query
	const { usersRepository } = request.diScope.cradle

	const list = ids.split(',')

	const users = await usersRepository.findManyById(list)

	return reply.status(200).send(users)
})
