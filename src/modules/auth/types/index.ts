import type { IThrottler } from '@/core/lib/throttler.js'
import type { Maybe } from '@/core/types/common.js'
import type { BaseDiConfig, InjectableDependencies } from '@/core/types/deps.js'
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

interface ICookieService {
	setJwtToken: (reply: FastifyReply, token: string, expiresAt: Date) => void
	deleteJwtToken: (reply: FastifyReply) => void
	setEmailVerificationCookie: (
		reply: FastifyReply,
		token: string,
		expiresAt: Date,
	) => void
	deleteEmailVerificationCookie: (reply: FastifyReply) => void
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

interface AuthModuleDependencies {
	passwordService: IPasswordService
	cookieService: ICookieService
	loginThrottler: IThrottler<string>
	emailVerificationService: IEmailVerificationService
}

type AuthInjectableDependencies = InjectableDependencies<AuthModuleDependencies>
type AuthDiConfig = BaseDiConfig<AuthModuleDependencies>

export type {
	AuthDiConfig,
	AuthModuleDependencies,
	IPasswordService,
	ICookieService,
	IEmailVerificationService,
	AuthInjectableDependencies,
	EmailVerificationRequest,
}
