import type { DatabaseClient } from '@/core/types/deps.js'
import {
	authProviderTable,
	internalCredentialTable,
	userTable,
} from '@/db/schema/index.js'
import type { AdminUser } from '@/db/types.js'
import { eq, sql } from 'drizzle-orm'
import type {
	AdminInjectableDependencies,
	IAdminRepository,
} from '../types/index.js'

export class AdminRepository implements IAdminRepository {
	private readonly db: DatabaseClient

	constructor({ db }: AdminInjectableDependencies) {
		this.db = db.client
	}

	async getUsers(): Promise<AdminUser[]> {
		return this.db
			.select({
				id: userTable.id,
				firstName: userTable.firstName,
				lastName: userTable.lastName,
				username: userTable.username,
				avatar: userTable.avatar,
				email:
					sql<string>`coalesce(${internalCredentialTable.email}, ${authProviderTable.email})`.as(
						'email',
					),
				role: userTable.role,
				type: sql<string>`
				case
					when ${internalCredentialTable.userId} is not null then 'internal'
					when ${authProviderTable.userId} is not null then 'external'
					else 'unknown'
				end
			`.as('type'),
				isVerified: userTable.isVerified,
				bio: userTable.bio,
			})
			.from(userTable)
			.leftJoin(
				internalCredentialTable,
				eq(internalCredentialTable.userId, userTable.id),
			)
			.leftJoin(
				authProviderTable,
				eq(authProviderTable.userId, userTable.id),
			) as unknown as AdminUser[]
	}
}
