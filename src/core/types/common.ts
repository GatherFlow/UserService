import type { FastifyInstance } from 'fastify'
import type http from 'node:http'

type AppInstance = FastifyInstance<
	http.Server,
	http.IncomingMessage,
	http.ServerResponse
>

type Maybe<T> = T | undefined | null

interface JwtPayload {
	userId: string
}

export type { AppInstance, Maybe, JwtPayload }
