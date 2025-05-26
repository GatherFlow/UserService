import type { DatabaseClient } from '@/core/types/deps.js'
import type {
	IProfilesRepository,
	UsersInjectableDependencies,
} from '../types/index.js'
import type { Language, UserLanguage, UserPrivacy } from '@/db/types.js'
import type {
	EDIT_USER_PROFILE_TYPE,
	MANAGE_PRIVACY_TYPE,
} from '../schemas/index.js'
import {
	userLanguageTable,
	userPrivacyTable,
	userTable,
} from '@/db/schema/index.js'
import { eq, getTableColumns } from 'drizzle-orm'

export class ProfilesRepository implements IProfilesRepository {
	private readonly db: DatabaseClient

	constructor({ db }: UsersInjectableDependencies) {
		this.db = db.client
	}

	async getPrivacy(id: string): Promise<UserPrivacy> {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { id: privacyId, userId, ...rest } = getTableColumns(userPrivacyTable)

		const privacyRows = await this.db
			.select({ ...rest })
			.from(userPrivacyTable)
			.where(eq(userPrivacyTable.userId, id))
			.limit(1)

		return privacyRows.at(0)!
	}

	async getLanguage(id: string): Promise<UserLanguage> {
		const languageRows = await this.db
			.select({ language: userLanguageTable.code })
			.from(userLanguageTable)
			.where(eq(userLanguageTable.userId, id))
			.limit(1)

		return languageRows.at(0)!
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

	async editProfile(
		userId: string,
		data: EDIT_USER_PROFILE_TYPE,
	): Promise<void> {
		await this.db
			.update(userTable)
			.set({ ...data })
			.where(eq(userTable.id, userId))
	}

	async verify(userId: string): Promise<void> {
		await this.db
			.update(userTable)
			.set({ isVerified: true })
			.where(eq(userTable.id, userId))
	}
}
