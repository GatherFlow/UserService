import { DAY } from '@/core/constants/time.js'
import type { DatabaseClient } from '@/core/types/deps.js'
import {
	authProviderTable,
	internalCredentialTable,
	userTable,
} from '@/db/schema/index.js'
import { eq, or } from 'drizzle-orm'
import type { Redis } from 'ioredis'
import type {
	ICredentialsService,
	UsersInjectableDependencies,
} from '../types/index.js'

export class CredentialsService implements ICredentialsService {
	private static readonly CACHE_TTL: number = 7 * DAY

	private readonly db: DatabaseClient
	private readonly cache: Redis

	constructor({ db, cache }: UsersInjectableDependencies) {
		this.db = db.client
		this.cache = cache
	}

	async isEmailAvailable(email: string): Promise<boolean> {
		const KEY = `email:${email}`

		const isCached = await this.cache.exists(KEY)

		if (isCached) {
			return false
		}

		const result = await this.db
			.select({ id: userTable.id })
			.from(userTable)
			.innerJoin(
				internalCredentialTable,
				eq(internalCredentialTable.userId, userTable.id),
			)
			.innerJoin(authProviderTable, eq(authProviderTable.userId, userTable.id))
			.where(
				or(
					eq(internalCredentialTable.email, email),
					eq(authProviderTable.email, email),
				),
			)
			.limit(1)

		await this.cache.setex(KEY, CredentialsService.CACHE_TTL, 'taken')

		return result.length === 0
	}

	async isUsernameAvailable(username: string): Promise<boolean> {
		const KEY = `username:${username}`

		const isCached = await this.cache.exists(KEY)

		if (isCached) {
			return false
		}

		const result = await this.db
			.select({ id: userTable.id })
			.from(userTable)
			.where(eq(userTable.username, username))
			.limit(1)

		await this.cache.setex(KEY, CredentialsService.CACHE_TTL, 'taken')

		return result.length === 0
	}
}
