import { JWT_EXPIRATION_TIME } from '@/core/constants/jwt.js'
import {
	InternalServerError,
	TooManyRequestsError,
} from '@/core/errors/index.js'
import { Problem } from '@/core/lib/problem.js'
import { throwHttpError } from '@/core/utils/index.js'
import type { CREATE_INTERNAL_USER_TYPE } from '@/modules/users/schemas/index.js'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { EmailAlreadyUsedError } from '../errors/email-already-used.js'
import { InvalidCredentialsError } from '../errors/invalid-credentials.js'
import type {
	EMAIL_VERIFICATION_TYPE,
	LOGIN_TYPE,
	PASSWORD_RESET_TYPE,
	REQUEST_PASSWORD_RESET_TYPE,
} from '../schema/index.js'
import { protectedRoute } from '@/core/guards/index.js'
import { EMAIL_VERIFICATION_COOKIE } from '@/core/constants/mailer.js'
import { IncorrectCode } from '../errors/incorrect-code.js'
import { MissingVerificationTokenError } from '../errors/missing-verification-token.js'
import { VerificationSessionNotFoundError } from '../errors/verification-session-not-found.js'
import { InvalidEmailError } from '../errors/invalid-email.js'
import { RESET_PASSWORD_SESSION_COOKIE } from '@/core/constants/reset-password.js'
import { MissingResetTokenError } from '../errors/missing-reset-token.js'
import { ResetSessionNotFound } from '../errors/reset-session-not-found.js'
import { ResetEmailNotVerified } from '../errors/reset-email-not-verified.js'

export const login = async (
	request: FastifyRequest<{ Body: LOGIN_TYPE }>,
	reply: FastifyReply,
): Promise<void> => {
	const { email, password } = request.body
	const { passwordService, loginThrottler, usersRepository, cookieService } =
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

	const expiresAt = new Date(Date.now() + JWT_EXPIRATION_TIME)

	cookieService.setJwtToken(reply, token, expiresAt)

	return reply.status(200).send('Cookie send')
}

export const signup = async (
	request: FastifyRequest<{ Body: CREATE_INTERNAL_USER_TYPE }>,
	reply: FastifyReply,
): Promise<void> => {
	const { email, password } = request.body
	const {
		usersRepository,
		passwordService,
		cookieService,
		emailVerificationService,
		credentialsService,
	} = request.diScope.cradle

	const isEmailTaken = await credentialsService.isEmailAvailable(email)

	if (!isEmailTaken) {
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

	const expiresAt = new Date(Date.now() + JWT_EXPIRATION_TIME)

	if (user.role === 'supervisor') {
		cookieService.setJwtToken(reply, token, expiresAt)

		return reply.status(200).send('Cookie send')
	}

	const verificationRequest = await emailVerificationService.createRequest(
		user.id,
	)

	await emailVerificationService.sendEmail(email, verificationRequest.code)

	cookieService.setEmailVerificationCookie(
		reply,
		verificationRequest.token,
		verificationRequest.expiresAt!,
	)

	cookieService.setJwtToken(reply, token, expiresAt)

	return reply.status(200).send('Cookie send')
}

export const logout = async (
	request: FastifyRequest,
	reply: FastifyReply,
): Promise<void> => {
	const { cookieService } = request.diScope.cradle

	cookieService.deleteJwtToken(reply)

	return reply.status(200).send('Logout completed successfully')
}

export const me = protectedRoute(async (request, reply) => {
	return reply.status(200).send(request.user)
})

export const verifyEmail = protectedRoute<{ Body: EMAIL_VERIFICATION_TYPE }>(
	async (request, reply) => {
		const { code } = request.body
		const { emailVerificationService, cookieService, profilesRepository } =
			request.diScope.cradle

		const token = request.cookies[EMAIL_VERIFICATION_COOKIE]

		if (!token) {
			const problem = Problem.withInstance(
				Problem.from(new MissingVerificationTokenError()),
				request.url,
			)

			return throwHttpError(reply, problem)
		}

		const verificationRequest = await emailVerificationService.getRequest(
			request.user.id,
			token,
		)

		if (!verificationRequest) {
			const newRequest = await emailVerificationService.createRequest(
				request.user.id,
			)

			await emailVerificationService.sendEmail(
				request.user.email,
				newRequest.code,
			)
			cookieService.setEmailVerificationCookie(
				reply,
				newRequest.token,
				newRequest.expiresAt!,
			)

			return reply
				.status(202)
				.send(
					'The verification code was expired. We sent another code to your inbox.',
				)
		}

		if (code !== verificationRequest.code) {
			const problem = Problem.withInstance(
				Problem.from(new IncorrectCode(code)),
				request.url,
			)

			return throwHttpError(reply, problem)
		}

		await emailVerificationService.deleteRequest(`${request.user.id}:${token}`)
		await profilesRepository.verify(request.user.id)
		cookieService.deleteEmailVerificationCookie(reply)
	},
)

export const sendVerificationEmailAgain = protectedRoute(
	async (request, reply) => {
		const token = request.cookies[EMAIL_VERIFICATION_COOKIE]

		if (!token) {
			const problem = Problem.withInstance(
				Problem.from(new MissingVerificationTokenError()),
				request.url,
			)

			return throwHttpError(reply, problem)
		}

		const { emailVerificationService } = request.diScope.cradle

		const verificationRequest = await emailVerificationService.getRequest(
			request.user.id,
			token,
		)

		if (!verificationRequest) {
			const problem = Problem.withInstance(
				Problem.from(new VerificationSessionNotFoundError()),
				request.url,
			)

			return throwHttpError(reply, problem)
		}

		await emailVerificationService.sendEmail(
			request.user.email,
			verificationRequest.code,
		)

		return reply.status(204).send()
	},
)

export const requestPasswordReset = async (
	request: FastifyRequest<{ Body: REQUEST_PASSWORD_RESET_TYPE }>,
	reply: FastifyReply,
): Promise<void> => {
	const { usersRepository, resetPasswordService, cookieService } =
		request.diScope.cradle
	const { email } = request.body

	const user = await usersRepository.findInternalBy('email', email)

	if (!user) {
		const problem = Problem.withInstance(
			Problem.from(new InvalidEmailError()),
			request.url,
		)

		return throwHttpError(reply, problem)
	}

	const session = await resetPasswordService.createSession(user.id, email)

	await resetPasswordService.sendEmail(email, session.code)

	cookieService.setPasswordResetCookie(reply, session.id, session.expiresAt)

	return reply.status(200).send(session)
}

export const verifyResetEmail = async (
	request: FastifyRequest<{ Body: EMAIL_VERIFICATION_TYPE }>,
	reply: FastifyReply,
): Promise<void> => {
	const { resetPasswordService, cookieService } = request.diScope.cradle

	const sessionId = request.cookies[RESET_PASSWORD_SESSION_COOKIE]

	if (!sessionId) {
		const problem = Problem.withInstance(
			Problem.from(new MissingResetTokenError()),
			request.url,
		)

		return throwHttpError(reply, problem)
	}

	const session = await resetPasswordService.getSession(sessionId)

	if (!session) {
		const problem = Problem.withInstance(
			Problem.from(new ResetSessionNotFound()),
			request.url,
		)

		return throwHttpError(reply, problem)
	}

	if (new Date() > session.expiresAt) {
		const newSession = await resetPasswordService.createSession(
			session.userId,
			session.email,
		)

		await resetPasswordService.sendEmail(session.email, session.code)
		cookieService.setPasswordResetCookie(
			reply,
			newSession.id,
			session.expiresAt,
		)

		return reply
			.status(202)
			.send(
				'The verification code was expired. We sent another code to your inbox.',
			)
	}

	const { code } = request.body

	if (session.code !== code) {
		const problem = Problem.withInstance(
			Problem.from(new IncorrectCode(code)),
			request.url,
		)

		return throwHttpError(reply, problem)
	}

	await resetPasswordService.verifyEmail(session.id)

	return reply.status(204).send()
}

export const resetPassword = async (
	request: FastifyRequest<{ Body: PASSWORD_RESET_TYPE }>,
	reply: FastifyReply,
): Promise<void> => {
	const {
		resetPasswordService,
		cookieService,
		passwordService,
		usersRepository,
	} = request.diScope.cradle

	const sessionId = request.cookies[RESET_PASSWORD_SESSION_COOKIE]

	if (!sessionId) {
		const problem = Problem.withInstance(
			Problem.from(new MissingResetTokenError()),
			request.url,
		)

		return throwHttpError(reply, problem)
	}

	const session = await resetPasswordService.getSession(sessionId)

	if (!session) {
		const problem = Problem.withInstance(
			Problem.from(new ResetSessionNotFound()),
			request.url,
		)

		return throwHttpError(reply, problem)
	}

	if (!session.isEmailVerified) {
		const problem = Problem.withInstance(
			Problem.from(new ResetEmailNotVerified()),
			request.url,
		)

		return throwHttpError(reply, problem)
	}

	const { password } = request.body
	const hashedPassword = await passwordService.generateHash(password)

	await usersRepository.changePassword(session.userId, hashedPassword)

	await resetPasswordService.invalidateSession(session.id)
	cookieService.deletePasswordResetCookie(reply)

	return reply.status(204).send()
}
