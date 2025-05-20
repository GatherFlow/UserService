import type { Maybe } from '@/core/types/common.js'
import type { DatabaseClient } from '@/core/types/deps.js'
import { internalCredentialTable } from '@/db/schema/internalCredentials.js'
import { userTable } from '@/db/schema/users.js'
import type {
	InternalCredentials,
	InternalUser,
	PublicUser,
	User,
} from '@/db/types.js'
import { eq, getTableColumns, or } from 'drizzle-orm'
import type {
	FindBy,
	IUsersRepository,
	UsersInjectableDependencies,
} from '../types/index.js'
import type { Redis } from 'ioredis'
import { authProviderTable } from '@/db/schema/authProviders.js'
import { DAY } from '@/core/constants/time.js'
import { Result } from '@/core/lib/result.js'
import type { CREATE_INTERNAL_USER_TYPE } from '../schemas/index.js'
import { toPublicUser } from '../utils/index.js'

export class UsersRepository implements IUsersRepository {
	private readonly db: DatabaseClient
	private readonly cache: Redis

	constructor({ db, cache }: UsersInjectableDependencies) {
		this.db = db.client
		this.cache = cache
	}

	async findAll(): Promise<User[]> {
		return this.db.select().from(userTable)
	}

	// TODO: Refactor to accept third-party users
	async getCurrent(id: string): Promise<PublicUser> {
		const user = await this.findInternalBy('id', id)

		return toPublicUser(user!)
	}

	async findInternalBy<K extends FindBy>(
		by: K,
		value: InternalCredentials[K],
	): Promise<Maybe<InternalUser>> {
		const [user] = await this.db
			.select({
				...getTableColumns(userTable),
				email: internalCredentialTable.email,
				password: internalCredentialTable.passwordHash,
			})
			.from(userTable)
			.innerJoin(
				internalCredentialTable,
				eq(internalCredentialTable.userId, userTable.id),
			)
			.where(
				// @ts-expect-error error is caused because of drizzle's typization issue
				eq(
					by === 'email' ? internalCredentialTable.email : userTable.id,
					value,
				),
			)

		return user ?? null
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

		await this.cache.setex(KEY, 7 * DAY, 'taken')

		return result.length === 0
	}

	async createInternal(
		data: CREATE_INTERNAL_USER_TYPE,
	): Promise<Result<InternalUser, null>> {
		try {
			const { firstName, lastName, email, password } = data
			const KEY = 'has-supervisor'

			const hasSupervisor = await this.cache.exists(KEY)

			const result = await this.db.transaction(async (tx) => {
				const rows = await tx
					.insert(userTable)
					.values({
						firstName,
						lastName,
						avatar: '/',
						isVerified: false,
						role: hasSupervisor ? 'user' : 'supervisor',
					})
					.returning()

				const user = rows.at(0)!

				const credsRows = await tx
					.insert(internalCredentialTable)
					.values({ userId: user.id, email, passwordHash: password })
					.returning()

				const creds = credsRows.at(0)!

				return { ...user, email: creds.email, password: creds.passwordHash }
			})

			return Result.success(result)
		} catch {
			return Result.fail(null)
		}
	}
}
