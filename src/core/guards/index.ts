import { AuthRequiredError } from '@/modules/auth/errors/auth-required.js'
import type {
	FastifyReply,
	FastifyRequest,
	RouteGenericInterface,
} from 'fastify'
import { Problem } from '../lib/problem.js'
import { throwHttpError } from '../utils/common.js'

type ProtectedHandler<T extends RouteGenericInterface> = (
	request: FastifyRequest<T>,
	reply: FastifyReply,
) => Promise<void>

export const protectedRoute = <T extends RouteGenericInterface>(
	handler: ProtectedHandler<T>,
) => {
	return async (request: FastifyRequest<T>, reply: FastifyReply) => {
		const { usersService } = request.diScope.cradle

		const payload = await request.jwtVerify()

		// @ts-expect-error payload object doesn't have typization
		const user = await usersService.getCurrent(payload.userId)

		if (!user) {
			const problem = Problem.withInstance(
				Problem.from(new AuthRequiredError()),
				request.url,
			)

			return throwHttpError(reply, problem)
		}

		request.user = user

		return handler(request, reply)
	}
}
