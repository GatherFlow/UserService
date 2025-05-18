import { Redis } from 'ioredis'

interface ThrottlerOptions {
	key: string
	cache: Redis
}

interface ThrottlingCounter {
	index: number
	updatedAt: number
}

export interface IThrottler<K> {
	consume: (key: K) => Promise<boolean>
	reset: (key: K) => Promise<void>
}

export class Throttler<K> implements IThrottler<K> {
	private static readonly TIMEOUT_SECONDS = [1, 2, 4, 8, 16, 30, 60, 180, 300]
	private readonly storageKey: string
	private readonly cache: Redis

	constructor({ key, cache }: ThrottlerOptions) {
		this.storageKey = key
		this.cache = cache
	}

	async consume(key: K): Promise<boolean> {
		const _key = this.getKey(key)

		const now = Math.floor(Date.now() / 1000)
		const fields = await this.cache.hgetall(_key)

		if (Object.keys(fields).length === 0) {
			const obj = {
				index: 1,
				updatedAt: now,
			} satisfies ThrottlingCounter

			const a = await this.cache.hmset(_key, obj)

			console.log(a)

			return true
		}

		const index = 'index' in fields ? +fields.index : 0
		const updatedAt = 'updatedAt' in fields ? +fields.updatedAt : 0

		const isAllowed = now - updatedAt >= Throttler.TIMEOUT_SECONDS[index]!

		if (!isAllowed) {
			return false
		}

		await this.cache.hmset(_key, {
			index: Math.min(index + 1, Throttler.TIMEOUT_SECONDS.length - 1),
			updated_at: now,
		})

		return true
	}

	async reset(key: K): Promise<void> {
		const _key = this.getKey(key)

		await this.cache.del(_key)
	}

	private getKey(key: K): string {
		return `${this.storageKey}:${key}`
	}
}
