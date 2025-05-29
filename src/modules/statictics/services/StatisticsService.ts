import type { DatabaseClient } from '@/core/types/deps.js'
import type {
	IStatisticsService,
	StatisticsInjectableDependencies,
} from '../types/index.js'
import { sql } from 'drizzle-orm'
import { userTable } from '@/db/schema/users.js'

export class StatisticsService implements IStatisticsService {
	private readonly db: DatabaseClient

	constructor({ db }: StatisticsInjectableDependencies) {
		this.db = db.client
	}

	async getTotalUsers(): Promise<number> {
		const [count] = await this.db
			.select({
				count: sql`count(*)`.mapWith(Number),
			})
			.from(userTable)

		return count?.count as number
	}
}
