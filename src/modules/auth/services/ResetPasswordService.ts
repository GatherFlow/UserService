import { EMAIL_SENDER } from '@/core/constants/mailer.js'
import { MINUTE } from '@/core/constants/time.js'
import type { Maybe } from '@/core/types/common.js'
import type { DatabaseClient } from '@/core/types/deps.js'
import { passwordResetSessionTable } from '@/db/schema/passwordResetSessions.js'
import type { PasswordResetSession } from '@/db/types.js'
import { and, eq } from 'drizzle-orm'
import type { Redis } from 'ioredis'
import type { Resend } from 'resend'
import {
	type AuthInjectableDependencies,
	type IResetPasswordService,
} from '../types/index.js'
import { generateOTP } from '../utils/otp.js'

export class ResetPasswordService implements IResetPasswordService {
	private readonly db: DatabaseClient
	private readonly cache: Redis
	private readonly mailer: Resend

	constructor({ db, cache, mailer }: AuthInjectableDependencies) {
		this.db = db.client
		this.cache = cache
		this.mailer = mailer
	}

	async getSession(sessionId: string): Promise<Maybe<PasswordResetSession>> {
		const [session] = await this.db
			.select()
			.from(passwordResetSessionTable)
			.where(and(eq(passwordResetSessionTable.id, sessionId)))

		return session ?? null
	}

	async createSession(
		userId: string,
		email: string,
	): Promise<PasswordResetSession> {
		const code = generateOTP()
		const expiresAt = new Date(Date.now() + 10 * MINUTE)

		const [session] = await this.db
			.insert(passwordResetSessionTable)
			.values({ userId, email, expiresAt, code })
			.returning()

		return session!
	}

	async sendEmail(email: string, code: string) {
		await this.mailer.emails.send({
			from: EMAIL_SENDER,
			to: [email],
			subject: 'Your Password Reset Code',
			text: `Your password reset code is: ${code}`,
		})
	}

	async invalidateSession(sessionId: string): Promise<void> {
		await this.db
			.delete(passwordResetSessionTable)
			.where(eq(passwordResetSessionTable.id, sessionId))
	}

	async verifyEmail(sessionId: string) {
		await this.db
			.update(passwordResetSessionTable)
			.set({ isEmailVerified: true })
			.where(eq(passwordResetSessionTable.id, sessionId))
	}
}
