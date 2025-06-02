import type { AppInstance } from '@/core/types/common.js'
import { env } from '@/env.js'
import { registerDependencies } from '@/infrastructure/parentDiConfig.js'
import { diContainer, fastifyAwilixPlugin } from '@fastify/awilix'
import fastifyCookie from '@fastify/cookie'
import fastifyCors from '@fastify/cors'
import fastifyHelmet from '@fastify/helmet'
import fastifyJwt from '@fastify/jwt'
import fastifyRateLimit from '@fastify/rate-limit'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import fastify from 'fastify'
import {
	createJsonSchemaTransform,
	serializerCompiler,
	validatorCompiler,
	type ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { plugin } from 'i18next-http-middleware'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { JWT_COOKIE_NAME, JWT_EXPIRATION_TIME } from './core/constants/index.js'
import i18n from './infrastructure/i18n.js'
import { getRoutes } from './modules/index.js'

export class App {
	private readonly app: AppInstance

	constructor() {
		this.app = fastify({
			logger: {
				transport: {
					target: 'pino-pretty',
					options: {
						colorize: true,
					},
				},
			},
		})
	}

	private async registerPlugins(): Promise<void> {
		this.app.setValidatorCompiler(validatorCompiler)
		this.app.setSerializerCompiler(serializerCompiler)

		await this.app.register(fastifyCors, {
			origin: [env.CORS_ORIGIN],
			credentials: true,
			methods: ['GET', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
		})

		await this.app.register(fastifyHelmet)

		await this.app.register(fastifySwagger, {
			transform: createJsonSchemaTransform({
				skipList: [
					'/documentation',
					'/documentation/initOAuth',
					'/documentation/json',
					'/documentation/uiConfig',
					'/documentation/yaml',
					'/documentation/*',
					'/documentation/static/*',
					'*',
				],
			}),
			openapi: {
				info: {
					title: 'GatherFlow Users Service',
					description: '',
					version: '0.0.0',
				},
			},
		})

		await this.app.register(fastifySwaggerUi, {
			routePrefix: '/',
		})

		await this.app.register(fastifyAwilixPlugin, {
			disposeOnClose: true,
			asyncDispose: true,
			asyncInit: true,
			eagerInject: true,
			disposeOnResponse: true,
		})

		await this.app.register(fastifyCookie, {
			secret: env.COOKIE_SECRET,
			hook: 'preHandler',
		})

		await this.app.register(fastifyJwt, {
			secret: {
				private: {
					key: readFileSync(
						`${join(import.meta.dirname, 'secrets')}/private.pem`,
						'utf-8',
					),
					passphrase: env.JWT_PASSPHRASE,
				},
				public: readFileSync(
					`${join(import.meta.dirname, 'secrets')}/public.pem`,
					'utf-8',
				),
			},
			cookie: {
				signed: false,
				cookieName: JWT_COOKIE_NAME,
			},
			sign: {
				algorithm: 'RS256',
				expiresIn: JWT_EXPIRATION_TIME,
			},
			verify: { algorithms: ['RS256'] },
		})

		this.app.addHook('preHandler', (request, reply, next) => {
			request.jwt = this.app.jwt

			next()
		})

		await this.app.register(fastifyRateLimit, {
			max: 100,
			ban: 150,
			timeWindow: 15 * 1000,
			allowList: ['127.0.0.1'],
		})

		this.app.register(plugin, {
			i18next: i18n,
		})

		registerDependencies(diContainer, { app: this.app })
	}

	private registerRoutes(): void {
		const { routes } = getRoutes()

		for (const route of routes) {
			this.app.withTypeProvider<ZodTypeProvider>().route(route)
		}
	}

	async initialize(): Promise<AppInstance> {
		try {
			await this.registerPlugins()

			this.app.after(() => {
				this.registerRoutes()
			})

			await this.app.ready()

			return this.app
		} catch (e: unknown) {
			this.app.log.error('Error while initializing app ', e)

			throw e
		}
	}
}
