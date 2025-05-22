import type {
	Config,
	DbConfig,
	CacheConfig,
	MailerConfig,
} from '@/core/types/index.js'
import { env } from '@/env.js'

const getDbConfig = (): DbConfig => ({
	user: env.POSTGRES_USER,
	password: env.POSTGRES_PASSWORD,
	host: env.POSTGRES_HOST,
	port: env.POSTGRES_PORT,
	database: env.POSTGRES_DB,
})

const getCacheConfig = (): CacheConfig => ({
	host: env.CACHE_HOST,
	user: env.CACHE_USER,
	password: env.CACHE_PASSWORD,
	port: env.CACHE_PORT,
})

const getMailerConfig = (): MailerConfig => ({
	apiKey: env.RESEND_API_KEY,
})

const getConfig = (): Config => ({
	db: getDbConfig(),
	cache: getCacheConfig(),
	mailer: getMailerConfig(),
})

export { getConfig }
