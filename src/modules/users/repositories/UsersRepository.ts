import type { DatabaseClient } from '@/core/types/deps.js'
import { userTable } from '@/db/schema/users.js'
import type { User } from '@/db/types.js'
import type {
	IUsersRepository,
	UsersInjectableDependencies,
} from '../types/index.js'

export class UsersRepository implements IUsersRepository {
	private readonly db: DatabaseClient

	constructor({ db }: UsersInjectableDependencies) {
		this.db = db.client
	}

	async findAll(): Promise<User[]> {
		return this.db.select().from(userTable)
	}
}
