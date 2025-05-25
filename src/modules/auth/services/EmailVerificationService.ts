import type { Redis } from 'ioredis'
import type {
	AuthInjectableDependencies,
	EmailVerificationRequest,
	IEmailVerificationService,
} from '../types/index.js'
import { getRandomValues, randomBytes } from 'node:crypto'
import { MINUTE } from '@/core/constants/time.js'
import type { Resend } from 'resend'
import { EMAIL_SENDER } from '@/core/constants/mailer.js'
import type { Maybe } from '@/core/types/common.js'

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
		const otp = this.generateOTP()
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

	private generateOTP(): string {
		const chars =
			'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
		const array = new Uint8Array(4)
		getRandomValues(array)

		let result = ''

		for (let i = 0; i < 4; i++) {
			// @ts-expect-error idk
			result += chars[array[i] % chars.length]
		}

		return result
	}
}
