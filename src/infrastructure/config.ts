import type {
	Config,
	DbConfig,
	CacheConfig,
	MailerConfig,
	GoogleOAuthConfig,
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

const getGoogleOAuthConfig = (): GoogleOAuthConfig => ({
	clientId: env.GOOGLE_CLIENT_ID,
	clientSecret: env.GOOGLE_CLIENT_SECRET,
	redirectURI: env.GOOGLE_REDIRECT_URI,
})

const getConfig = (): Config => ({
	db: getDbConfig(),
	cache: getCacheConfig(),
	mailer: getMailerConfig(),
	googleOAuth: getGoogleOAuthConfig(),
})

export { getConfig }
