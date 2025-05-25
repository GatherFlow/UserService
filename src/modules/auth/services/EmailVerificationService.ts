import { EMAIL_SENDER } from '@/core/constants/mailer.js'
import { MINUTE } from '@/core/constants/time.js'
import type { Maybe } from '@/core/types/common.js'
import type { Redis } from 'ioredis'
import { randomBytes } from 'node:crypto'
import type { Resend } from 'resend'
import type {
	AuthInjectableDependencies,
	EmailVerificationRequest,
	IEmailVerificationService,
} from '../types/index.js'
import { generateOTP } from '../utils/otp.js'

export class EmailVerificationService implements IEmailVerificationService {
	private static readonly KEY_PREFIX = 'email-verification'
	private readonly cache: Redis
	private readonly mailer: Resend

	constructor({ cache, mailer }: AuthInjectableDependencies) {
		this.cache = cache
		this.mailer = mailer
	}

	async getRequest(
		userId: string,
		token: string,
	): Promise<Maybe<EmailVerificationRequest>> {
		const KEY = `${EmailVerificationService.KEY_PREFIX}:${userId}:${token}`

		const code = await this.cache.get(KEY)

		if (!code) {
			return null
		}

		return {
			token,
			userId,
			code,
		} satisfies EmailVerificationRequest
	}

	async createRequest(userId: string): Promise<EmailVerificationRequest> {
		const token = randomBytes(32).toString('hex')
		const KEY = `${EmailVerificationService.KEY_PREFIX}:${userId}:${token}`
		const otp = generateOTP()
		const ttl = 10 * MINUTE

		await this.cache.setex(KEY, ttl, otp)

		return {
			token,
			userId,
			code: otp,
			expiresAt: new Date(Date.now() + ttl),
		} satisfies EmailVerificationRequest
	}

	async sendEmail(email: string, code: string): Promise<void> {
		await this.mailer.emails.send({
			from: EMAIL_SENDER,
			to: [email],
			subject: 'Email Conformation',
			html: `
				<p>Your code ${code}</p>
			`,
		})
	}

	async deleteRequest(key: string): Promise<void> {
		await this.cache.del(`${EmailVerificationService.KEY_PREFIX}:${key}`)
	}

	async onCooldown(token: string, userId: string): Promise<boolean> {
		const KEY = `${EmailVerificationService.KEY_PREFIX}:cooldown:${userId}:${token}`

		const onCooldown = await this.cache.exists(KEY)

		if (onCooldown) {
			return true
		}

		await this.cache.setex(KEY, MINUTE, '1')

		return false
	}
}
