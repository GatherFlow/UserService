import 'dotenv/config.js'
import { z } from 'zod'

const envSchema = z.object({
	PORT: z.coerce.number().min(1000),
	POSTGRES_HOST: z.string(),
	POSTGRES_DB: z.string(),
	POSTGRES_USER: z.string(),
	POSTGRES_PASSWORD: z.string(),
	POSTGRES_PORT: z.coerce.number().default(5432),
	COOKIE_SECRET: z.string(),
	CACHE_HOST: z.string(),
	CACHE_USER: z.string(),
	CACHE_PASSWORD: z.string(),
	CACHE_PORT: z.coerce.number().default(6379),
	BASE_URL: z.string(),
	JWT_PASSPHRASE: z.string(),
	CORS_ORIGIN: z.string(),
	RESEND_API_KEY: z.string(),
	GOOGLE_CLIENT_ID: z.string(),
	GOOGLE_CLIENT_SECRET: z.string(),
	GOOGLE_REDIRECT_URI: z.string(),
})

const env = envSchema.parse(process.env)

export { env }
