import { protectedRoute } from '@/core/guards/index.js'
import { Problem } from '@/core/lib/problem.js'
import { throwHttpError } from '@/core/utils/common.js'
import { AccessDeniedError } from '@/modules/auth/errors/access-denied.js'
import { isAdmin } from '@/modules/auth/utils/role.js'
import type { EDIT_USER_PROFILE_TYPE } from '@/modules/users/schemas/index.js'
import type { GET_USER_PARAMS_TYPE } from '../schemas/index.js'

export const getAdminUsers = protectedRoute(async (request, reply) => {
	const { adminRepository } = request.diScope.cradle

	if (!isAdmin(request.user)) {
		const problem = Problem.withInstance(
			Problem.from(new AccessDeniedError()),
			request.url,
		)

		return throwHttpError(reply, problem)
	}

	const users = await adminRepository.getUsers()

	return reply.status(200).send(users)
})

export const editAdminUser = protectedRoute<{
	Params: GET_USER_PARAMS_TYPE
	Body: EDIT_USER_PROFILE_TYPE
}>(async (request, reply) => {
	const { profilesRepository } = request.diScope.cradle

	if (!isAdmin(request.user)) {
		const problem = Problem.withInstance(
			Problem.from(new AccessDeniedError()),
			request.url,
		)

		return throwHttpError(reply, problem)
	}

	const { id } = request.params

	await profilesRepository.editProfile(id, request.body)

	return reply.status(200).send()
})

export const deleteAdminUser = protectedRoute<{
	Params: GET_USER_PARAMS_TYPE
}>(async (request, reply) => {
	const { usersRepository, credentialsService, usersService } =
		request.diScope.cradle

	if (!isAdmin(request.user)) {
		const problem = Problem.withInstance(
			Problem.from(new AccessDeniedError()),
			request.url,
		)

		return throwHttpError(reply, problem)
	}

	const { id } = request.params

	const user = await usersService.getCurrent(id)

	if (!user) {
		return reply.status(404).send()
	}

	await usersRepository.deleteUser(id)
	await credentialsService.invalidate(user.email, user.username)

	return reply.status(200).send()
})
