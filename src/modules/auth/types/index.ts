import type { IThrottler } from '@/core/lib/throttler.js'
import type { BaseDiConfig } from '@/core/types/deps.js'
import type { FastifyReply } from 'fastify'

interface IPasswordService {
	generateHash: (password: string) => Promise<string>
	verify: (hash: string, password: string) => Promise<boolean>
}

interface ICookieService {
	setJwtToken: (reply: FastifyReply, token: string, expiresAt: Date) => void
	deleteJwtToken: (reply: FastifyReply) => void
}

interface AuthModuleDependencies {
	passwordService: IPasswordService
	cookieService: ICookieService
	loginThrottler: IThrottler<string>
}

type AuthDiConfig = BaseDiConfig<AuthModuleDependencies>

export type {
	AuthDiConfig,
	AuthModuleDependencies,
	IPasswordService,
	ICookieService,
}
