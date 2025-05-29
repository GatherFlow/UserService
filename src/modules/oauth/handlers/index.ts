import type { FastifyReply, FastifyRequest } from 'fastify'
import { generateState, generateCodeVerifier } from 'arctic'
import {
	GOOGLE_OAUTH_STATE_COOKIE,
	GOOGLE_OAUTH_VERIFIER_COOKIE,
} from '../constants/index.js'
import { MINUTE } from '@/core/constants/time.js'
import type { VALIDATE_GOOGLE_CALLBACK_TYPE } from '../schemas/index.js'
import type { OAuth2Tokens } from 'arctic'
import { decodeIdToken } from 'arctic'
import { JWT_COOKIE_NAME, JWT_EXPIRATION_TIME } from '@/core/constants/jwt.js'
import { Problem } from '@/core/lib/problem.js'
import { InternalServerError } from '@/core/errors/internal.js'
import { throwHttpError } from '@/core/utils/common.js'
import { InvalidCodeOrClientCredentialsError } from '../errors/invalid-code-or-client.js'
import { env } from '@/env.js'

export const googleAuthRedirect = async (
	request: FastifyRequest,
	reply: FastifyReply,
): Promise<void> => {
	const { googleOAuth, cookieService } = request.diScope.cradle

	const state = generateState()
	const codeVerifier = generateCodeVerifier()
	const scopes = ['openid', 'profile', 'email']

	const url = googleOAuth.createAuthorizationURL(state, codeVerifier, scopes)

	const expiresAt = new Date(Date.now() + 10 * MINUTE)

	cookieService.set({
		reply,
		name: GOOGLE_OAUTH_STATE_COOKIE,
		value: state,
		expiresAt,
	})

	cookieService.set({
		reply,
		name: GOOGLE_OAUTH_VERIFIER_COOKIE,
		value: codeVerifier,
		expiresAt,
	})

	return reply.redirect(url.toString())
}

export const validateGoogleCallback = async (
	request: FastifyRequest<{ Querystring: VALIDATE_GOOGLE_CALLBACK_TYPE }>,
	reply: FastifyReply,
): Promise<void> => {
	const { code, state } = request.query
	const { googleOAuth, usersRepository, cookieService } = request.diScope.cradle

	const storedState = request.cookies[GOOGLE_OAUTH_STATE_COOKIE]
	const codeVerifier = request.cookies[GOOGLE_OAUTH_VERIFIER_COOKIE]

	if (!storedState || !codeVerifier || state !== storedState) {
		const problem = Problem.withInstance(
			Problem.from(new InvalidCodeOrClientCredentialsError()),
			request.url,
		)

		return throwHttpError(reply, problem)
	}

	let tokens: OAuth2Tokens

	try {
		tokens = await googleOAuth.validateAuthorizationCode(code, codeVerifier)
	} catch {
		const problem = Problem.withInstance(
			Problem.from(new InvalidCodeOrClientCredentialsError()),
			request.url,
		)

		return throwHttpError(reply, problem)
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const claims: any = decodeIdToken(tokens.idToken())

	const googleUserId = claims.sub
	const email = claims.email
	const firstName = claims.given_name
	const lastName = claims.family_name
	const avatar = claims.picture

	const isExist = await usersRepository.findExternalBy(
		'providerId',
		googleUserId,
	)

	if (!isExist) {
		const result = await usersRepository.createExternal({
			providerId: googleUserId,
			email,
			firstName,
			lastName,
			locale: 'en', // TODO: remove harcoded value
			avatar,
			provider: 'google',
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

		cookieService.set({ reply, name: JWT_COOKIE_NAME, value: token, expiresAt })

		return reply.status(204).send()
	}

	const token = await reply.jwtSign({ userId: isExist.id })
	const expiresAt = new Date(Date.now() + JWT_EXPIRATION_TIME)

	cookieService.set({ reply, name: JWT_COOKIE_NAME, value: token, expiresAt })

	return reply.redirect(`${env.CORS_ORIGIN}`)
}
