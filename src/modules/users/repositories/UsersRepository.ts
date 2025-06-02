import { Result } from '@/core/lib/result.js'
import type { Maybe } from '@/core/types/common.js'
import type { DatabaseClient } from '@/core/types/deps.js'
import { authProviderTable } from '@/db/schema/authProviders.js'
import { internalCredentialTable } from '@/db/schema/internalCredentials.js'
import { userLanguageTable } from '@/db/schema/userLanguages.js'
import { userPrivacyTable } from '@/db/schema/userPrivacySettings.js'
import { userTable } from '@/db/schema/users.js'
import type {
	BaseUser,
	ExternalUser,
	InternalCredentials,
	InternalUser,
	Role,
	User,
} from '@/db/types.js'
import { eq, getTableColumns, inArray } from 'drizzle-orm'
import type { Redis } from 'ioredis'
import type {
	CREATE_EXTERNAL_USER_TYPE,
	CREATE_INTERNAL_USER_TYPE,
} from '../schemas/index.js'
import type {
	ExternalFindBy,
	IUsersRepository,
	InternalFindBy,
	UsersInjectableDependencies,
} from '../types/index.js'
import { DAY } from '@/core/constants/time.js'

export class UsersRepository implements IUsersRepository {
	private static readonly SUPERVISOR_PERSISTANCE_KEY: string = 'has-supervisor'
	private static readonly CACHE_TTL: number = 7 * DAY

	private readonly db: DatabaseClient
	private readonly cache: Redis

	constructor({ db, cache }: UsersInjectableDependencies) {
		this.db = db.client
		this.cache = cache
	}

	async findAll(): Promise<User[]> {
		return this.db.select().from(userTable)
	}

	async findInternalBy<K extends InternalFindBy>(
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
				eq(
					by === 'email' ? internalCredentialTable.email : userTable.id,
					value,
				),
			)

		return user ?? null
	}

	async findExternalBy<K extends ExternalFindBy>(
		by: K,
		value: ExternalUser[K],
	): Promise<Maybe<ExternalUser>> {
		const [user] = await this.db
			.select({
				...getTableColumns(userTable),
				email: authProviderTable.email,
				providerId: authProviderTable.providerUserId,
			})
			.from(userTable)
			.innerJoin(authProviderTable, eq(authProviderTable.userId, userTable.id))
			.where(
				eq(
					by === 'providerId' ? authProviderTable.providerUserId : userTable.id,
					value,
				),
			)

		return user ?? null
	}

	async findManyById(ids: string[]): Promise<BaseUser[]> {
		return this.db
			.select({
				id: userTable.id,
				firstName: userTable.firstName,
				lastName: userTable.lastName,
				username: userTable.username,
				avatar: userTable.avatar,
			})
			.from(userTable)
			.where(inArray(userTable.id, ids))
	}

	async createInternal(
		data: CREATE_INTERNAL_USER_TYPE,
	): Promise<Result<InternalUser, null>> {
		try {
			const { firstName, lastName, email, password, language } = data

			const username = email.split('@')[0]!

			const hasSupervisor = await this.hasSupervisor()

			const result = await this.db.transaction(
				async (tx) => {
					const rows = await tx
						.insert(userTable)
						.values({
							username,
							firstName,
							lastName,
							avatar: '/',
							isVerified: !hasSupervisor,
							role: UsersRepository.setRole(hasSupervisor),
						})
						.returning()

					const user = rows.at(0)!

					const credsRows = await tx
						.insert(internalCredentialTable)
						.values({ userId: user.id, email, passwordHash: password })
						.returning()

					const creds = credsRows.at(0)!

					await tx.insert(userPrivacyTable).values({
						isPrivate: false,
						hideAppreciated: false,
						hideOwned: false,
						hidePurchased: false,
						userId: user.id,
					})

					await tx
						.insert(userLanguageTable)
						.values({ code: language, userId: user.id })

					return { ...user, email: creds.email, password: creds.passwordHash }
				},
				{ isolationLevel: 'serializable' },
			)

			if (!hasSupervisor) {
				await this.persistSupervisor()
			}

			await this.persistCredentials(email, username)

			return Result.success(result)
		} catch {
			return Result.fail(null)
		}
	}

	async createExternal(
		data: CREATE_EXTERNAL_USER_TYPE,
	): Promise<Result<ExternalUser, null>> {
		const { locale, firstName, lastName, email, avatar, providerId, provider } =
			data
		const username = email.split('@')[0]!

		const hasSupervisor = await this.hasSupervisor()

		try {
			const result = await this.db.transaction(async (tx) => {
				const rows = await tx
					.insert(userTable)
					.values({
						username: username,
						firstName,
						lastName,
						avatar,
						isVerified: true,
						role: UsersRepository.setRole(hasSupervisor),
					})
					.returning()

				const user = rows.at(0)!

				await tx.insert(authProviderTable).values({
					email,
					provider,
					providerUserId: providerId,
					userId: user.id,
				})

				await tx.insert(userPrivacyTable).values({
					isPrivate: false,
					hideAppreciated: false,
					hideOwned: false,
					hidePurchased: false,
					userId: user.id,
				})

				await tx
					.insert(userLanguageTable)
					.values({ code: locale, userId: user.id })

				return { ...user, email, providerId }
			})

			if (!hasSupervisor) {
				await this.persistSupervisor()
			}

			await this.persistCredentials(email, username)

			return Result.success(result)
		} catch {
			return Result.fail(null)
		}
	}

	async changePassword(userId: string, password: string): Promise<void> {
		await this.db
			.update(internalCredentialTable)
			.set({ passwordHash: password })
			.where(eq(internalCredentialTable.userId, userId))
	}

	private async hasSupervisor(): Promise<boolean> {
		const has = await this.cache.exists(
			UsersRepository.SUPERVISOR_PERSISTANCE_KEY,
		)

		return !!has
	}

	private async persistCredentials(
		email: string,
		username: string,
	): Promise<void> {
		await this.cache.setex(
			`username:${username}`,
			UsersRepository.CACHE_TTL,
			'taken',
		)

		await this.cache.setex(`email:${email}`, UsersRepository.CACHE_TTL, 'taken')
	}

	private async persistSupervisor(): Promise<void> {
		await this.cache.set(UsersRepository.SUPERVISOR_PERSISTANCE_KEY, 'true')
	}

	private static setRole(hasSupervisor: boolean): Role {
		return hasSupervisor ? 'user' : 'supervisor'
	}

	async deleteUser(id: string): Promise<void> {
		await this.db.delete(userTable).where(eq(userTable.id, id))
	}
}
