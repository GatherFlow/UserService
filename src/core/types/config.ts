interface DbConfig {
	user: string
	password: string
	host: string
	port: number
	database: string
}

interface CacheConfig {
	user: string
	host: string
	port: number
	password: string
}

interface MailerConfig {
	apiKey: string
}

interface GoogleOAuthConfig {
	clientId: string
	clientSecret: string
	redirectURI: string
}

interface Config {
	db: DbConfig
	cache: CacheConfig
	mailer: MailerConfig
	googleOAuth: GoogleOAuthConfig
}

export type { Config, DbConfig, CacheConfig, MailerConfig, GoogleOAuthConfig }
