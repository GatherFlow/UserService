import type { BaseDiConfig, InjectableDependencies } from '@/core/types/deps.js'
import type { User } from '@/db/types.js'

interface IUsersRepository {
	findAll: () => Promise<User[]>
}

interface UsersModuleDependencies {
	usersRepository: IUsersRepository
}

type UsersInjectableDependencies =
	InjectableDependencies<UsersModuleDependencies>

type UsersDiConfig = BaseDiConfig<UsersModuleDependencies>

export type {
	IUsersRepository,
	UsersDiConfig,
	UsersInjectableDependencies,
	UsersModuleDependencies,
}
