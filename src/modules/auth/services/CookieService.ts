import type { FastifyReply } from 'fastify'
import type { ICookieService } from '../types/index.js'
import type { CookieSerializeOptions } from '@fastify/cookie'
import { JWT_COOKIE_NAME } from '@/core/constants/jwt.js'
import { EMAIL_VERIFICATION_COOKIE } from '@/core/constants/mailer.js'
import { RESET_PASSWORD_SESSION_COOKIE } from '@/core/constants/index.js'

export class CookieService implements ICookieService {
	private readonly SHARED_COOKIE_OPTIONS: CookieSerializeOptions = {
		httpOnly: true,
		sameSite: 'lax',
		path: '/',
	}

	setJwtToken(reply: FastifyReply, token: string, expiresAt: Date): void {
		reply.setCookie(JWT_COOKIE_NAME, token, {
			...this.SHARED_COOKIE_OPTIONS,
			expires: expiresAt,
			secure: process.env.NODE_ENV === 'production',
		})
	}

	deleteJwtToken(reply: FastifyReply): void {
		const cookieOptions: CookieSerializeOptions =
			process.env.NODE_ENV === 'production'
				? { ...this.SHARED_COOKIE_OPTIONS, maxAge: 0, secure: true }
				: { ...this.SHARED_COOKIE_OPTIONS, maxAge: 0 }

		reply.setCookie(JWT_COOKIE_NAME, '', cookieOptions)
	}

	setEmailVerificationCookie(
		reply: FastifyReply,
		token: string,
		expiresAt: Date,
	): void {
		reply.setCookie(EMAIL_VERIFICATION_COOKIE, token, {
			...this.SHARED_COOKIE_OPTIONS,
			expires: expiresAt,
			secure: process.env.NODE_ENV === 'production',
		})
	}

	deleteEmailVerificationCookie(reply: FastifyReply): void {
		const cookieOptions: CookieSerializeOptions =
			process.env.NODE_ENV === 'production'
				? { ...this.SHARED_COOKIE_OPTIONS, maxAge: 0, secure: true }
				: { ...this.SHARED_COOKIE_OPTIONS, maxAge: 0 }

		reply.setCookie(EMAIL_VERIFICATION_COOKIE, '', cookieOptions)
	}

	setPasswordResetCookie(
		reply: FastifyReply,
		token: string,
		expiresAt: Date,
	): void {
		reply.setCookie(RESET_PASSWORD_SESSION_COOKIE, token, {
			...this.SHARED_COOKIE_OPTIONS,
			expires: expiresAt,
			secure: process.env.NODE_ENV === 'production',
		})
	}

	deletePasswordResetCookie(reply: FastifyReply): void {
		const cookieOptions: CookieSerializeOptions =
			process.env.NODE_ENV === 'production'
				? { ...this.SHARED_COOKIE_OPTIONS, maxAge: 0, secure: true }
				: { ...this.SHARED_COOKIE_OPTIONS, maxAge: 0 }

		reply.setCookie(RESET_PASSWORD_SESSION_COOKIE, '', cookieOptions)
	}
}
