import type { IThrottler } from '@/core/lib/throttler.js'
import type { Maybe } from '@/core/types/common.js'
import type { BaseDiConfig, InjectableDependencies } from '@/core/types/deps.js'
import type { PasswordResetSession } from '@/db/types.js'
import type { FastifyReply } from 'fastify'

interface EmailVerificationRequest {
	token: string
	userId: string
	code: string
	expiresAt?: Date
}

interface IPasswordService {
	generateHash: (password: string) => Promise<string>
	verify: (hash: string, password: string) => Promise<boolean>
}

interface SetCookieArgs {
	reply: FastifyReply
	name: string
	value: string
	expiresAt: Date
}

interface ICookieService {
	set: (args: SetCookieArgs) => void
	delete: (reply: FastifyReply, name: string) => void
	setJwtToken: (reply: FastifyReply, token: string, expiresAt: Date) => void
	deleteJwtToken: (reply: FastifyReply) => void
	setEmailVerificationCookie: (
		reply: FastifyReply,
		token: string,
		expiresAt: Date,
	) => void
	deleteEmailVerificationCookie: (reply: FastifyReply) => void
	setPasswordResetCookie: (
		reply: FastifyReply,
		token: string,
		expiresAt: Date,
	) => void
	deletePasswordResetCookie: (reply: FastifyReply) => void
}

interface IEmailVerificationService {
	getRequest: (
		userId: string,
		token: string,
	) => Promise<Maybe<EmailVerificationRequest>>
	createRequest: (userId: string) => Promise<EmailVerificationRequest>
	deleteRequest: (key: string) => Promise<void>
	sendEmail: (email: string, code: string) => Promise<void>
	onCooldown: (token: string, userId: string) => Promise<boolean>
}

interface IResetPasswordService {
	getSession: (sessionId: string) => Promise<Maybe<PasswordResetSession>>
	createSession: (
		userId: string,
		email: string,
	) => Promise<PasswordResetSession>
	invalidateSession: (key: string) => Promise<void>
	sendEmail: (email: string, code: string) => Promise<void>
	verifyEmail: (sessionId: string) => Promise<void>
}

interface AuthModuleDependencies {
	passwordService: IPasswordService
	cookieService: ICookieService
	loginThrottler: IThrottler<string>
	emailVerificationService: IEmailVerificationService
	resetPasswordService: IResetPasswordService
}

type AuthInjectableDependencies = InjectableDependencies<AuthModuleDependencies>
type AuthDiConfig = BaseDiConfig<AuthModuleDependencies>

export type {
	AuthDiConfig,
	AuthInjectableDependencies,
	AuthModuleDependencies,
	EmailVerificationRequest,
	ICookieService,
	IEmailVerificationService,
	IPasswordService,
	IResetPasswordService,
	SetCookieArgs,
}
