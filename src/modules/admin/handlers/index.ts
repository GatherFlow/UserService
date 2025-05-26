import { protectedRoute } from '@/core/guards/index.js'
import { Problem } from '@/core/lib/problem.js'
import { throwHttpError } from '@/core/utils/common.js'
import { AccessDeniedError } from '@/modules/auth/errors/access-denied.js'
import { isAdmin } from '@/modules/auth/utils/role.js'

export const getAdminUsers = protectedRoute(async (request, reply) => {
	const { usersRepository } = request.diScope.cradle

	if (!isAdmin(request.user)) {
		const problem = Problem.withInstance(
			Problem.from(new AccessDeniedError()),
			request.url,
		)

		return throwHttpError(reply, problem)
	}

	const users = await usersRepository.findAll()

	return reply.status(200).send(users)
})
