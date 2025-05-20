import {
	InternalServerError,
	TooManyRequestsError,
} from '@/core/errors/index.js'
import { Problem } from '@/core/lib/problem.js'
import { isProduction, throwHttpError } from '@/core/utils/index.js'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { InvalidCredentialsError } from '../errors/invalid-credentials.js'
import type { LOGIN_TYPE } from '../schema/index.js'
import { JWT_COOKIE_NAME } from '@/core/constants/jwt.js'
import type { CREATE_INTERNAL_USER_TYPE } from '@/modules/users/schemas/index.js'
import { EmailAlreadyUsedError } from '../errors/email-already-used.js'

export const login = async (
	request: FastifyRequest<{ Body: LOGIN_TYPE }>,
	reply: FastifyReply,
): Promise<void> => {
	const { email, password } = request.body
	const { passwordService, loginThrottler, usersRepository } =
		request.diScope.cradle

	const user = await usersRepository.findInternalBy('email', email)

	if (!user) {
		const problem = Problem.withInstance(
			Problem.from(new InvalidCredentialsError()),
			request.url,
		)

		return throwHttpError(reply, problem)
	}

	const hasRequests = await loginThrottler.consume(user.id)

	if (!hasRequests) {
		const problem = Problem.withInstance(
			Problem.from(new TooManyRequestsError()),
			request.url,
		)

		return throwHttpError(reply, problem)
	}

	const isPasswordValid = await passwordService.verify(user.password, password)

	if (!isPasswordValid) {
		const problem = Problem.withInstance(
			Problem.from(new InvalidCredentialsError()),
			request.url,
		)

		return throwHttpError(reply, problem)
	}

	await loginThrottler.reset(user.id)

	const token = await reply.jwtSign({ userId: user.id })

	reply
		.setCookie(JWT_COOKIE_NAME, token, {
			path: '/',
			secure: isProduction() ? true : false,
			httpOnly: true,
			sameSite: 'lax',
		})
		.status(200)
		.send('Cookie sent')
}

export const signup = async (
	request: FastifyRequest<{ Body: CREATE_INTERNAL_USER_TYPE }>,
	reply: FastifyReply,
): Promise<void> => {
	const { email, password } = request.body
	const { usersRepository, passwordService } = request.diScope.cradle

	const isEmailTaken = await usersRepository.isEmailAvailable(email)

	if (isEmailTaken) {
		const problem = Problem.withInstance(
			Problem.from(new EmailAlreadyUsedError(email)),
			request.url,
		)

		return throwHttpError(reply, problem)
	}

	const hashedPassword = await passwordService.generateHash(password)

	const result = await usersRepository.createInternal({
		...request.body,
		password: hashedPassword,
	})

	if (result.isFailure()) {
		const problem = Problem.withInstance(
			Problem.from(new InternalServerError()),
			request.url,
		)

		return throwHttpError(reply, problem)
	}

	const user = result.value

	const token = await reply.jwtSign({ userId: user.id })

	reply
		.setCookie(JWT_COOKIE_NAME, token, {
			path: '/',
			secure: isProduction() ? true : false,
			httpOnly: true,
			sameSite: 'lax',
		})
		.status(200)
		.send('Cookie sent')
}

export const logout = async (
	_: FastifyRequest,
	reply: FastifyReply,
): Promise<void> => {
	reply
		.setCookie(JWT_COOKIE_NAME, '', {
			httpOnly: true,
			path: '/',
			sameSite: 'lax',
			secure: isProduction() ? true : false,
			maxAge: 0,
		})
		.status(200)
		.send('Logout completed successfully')
}

export const me = async (
	request: FastifyRequest,
	reply: FastifyReply,
): Promise<void> => {
	const { usersRepository } = request.diScope.cradle

	const payload = await request.jwtVerify()

	// @ts-expect-error payload object doesn't have typization
	const user = await usersRepository.getCurrent(payload.userId)

	reply.status(200).send(user)
}
