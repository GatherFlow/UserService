import { DAY } from '@/core/constants/time.js'
import { Result } from '@/core/lib/result.js'
import type { Maybe } from '@/core/types/common.js'
import type { DatabaseClient } from '@/core/types/deps.js'
import { authProviderTable } from '@/db/schema/authProviders.js'
import { internalCredentialTable } from '@/db/schema/internalCredentials.js'
import { userLanguageTable } from '@/db/schema/userLanguages.js'
import { userPrivacyTable } from '@/db/schema/userPrivacySettings.js'
import { userTable } from '@/db/schema/users.js'
import type {
	InternalCredentials,
	InternalUser,
	Language,
	PublicUser,
	User,
	UserLanguage,
	UserPrivacy,
} from '@/db/types.js'
import { eq, getTableColumns, or } from 'drizzle-orm'
import type { Redis } from 'ioredis'
import type {
	CREATE_INTERNAL_USER_TYPE,
	MANAGE_PRIVACY_TYPE,
} from '../schemas/index.js'
import type {
	FindBy,
	IUsersRepository,
	UsersInjectableDependencies,
} from '../types/index.js'
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
	async getCurrent(id: string): Promise<Maybe<PublicUser>> {
		const user = await this.findInternalBy('id', id)

		const language = await this.getUserLanguage(id)

		return user ? toPublicUser({ ...user, language: language.language }) : null
	}

	async getUserPrivacy(id: string): Promise<UserPrivacy> {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { id: privacyId, userId, ...rest } = getTableColumns(userPrivacyTable)

		const privacyRows = await this.db
			.select({ ...rest })
			.from(userPrivacyTable)
			.where(eq(userPrivacyTable, eq(userPrivacyTable.userId, id)))
			.limit(1)

		return privacyRows.at(0)!
	}

	async getUserLanguage(id: string): Promise<UserLanguage> {
		const languageRows = await this.db
			.select({ language: userLanguageTable.code })
			.from(userLanguageTable)
			.where(eq(userLanguageTable.userId, id))
			.limit(1)

		return languageRows.at(0)!
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
			const { firstName, lastName, email, password, language } = data
			const KEY = 'has-supervisor'

			const hasSupervisor = await this.cache.exists(KEY)

			const result = await this.db.transaction(
				async (tx) => {
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

			return Result.success(result)
		} catch {
			return Result.fail(null)
		}
	}

	async changeLanguage(userId: string, language: Language): Promise<void> {
		await this.db
			.update(userLanguageTable)
			.set({ code: language })
			.where(eq(userLanguageTable.userId, userId))
	}

	async managePrivacy(
		userId: string,
		data: MANAGE_PRIVACY_TYPE,
	): Promise<void> {
		await this.db
			.update(userPrivacyTable)
			.set({ ...data })
			.where(eq(userPrivacyTable.userId, userId))
	}
}
