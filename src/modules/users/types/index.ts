import type { Maybe } from '@/core/types/index.js'
import type { BaseDiConfig, InjectableDependencies } from '@/core/types/deps.js'
import type {
	InternalCredentials,
	InternalUser,
	PublicUser,
	User,
} from '@/db/types.js'
import type { CREATE_INTERNAL_USER_TYPE } from '../schemas/index.js'
import type { Result } from '@/core/lib/result.js'

type FindBy = 'id' | 'email'

interface IUsersRepository {
	findAll: () => Promise<User[]>
	findInternalBy: <K extends FindBy>(
		by: K,
		value: InternalCredentials[K],
	) => Promise<Maybe<InternalUser>>
	getCurrent: (id: string) => Promise<PublicUser>
	isEmailAvailable: (email: string) => Promise<boolean>
	createInternal: (
		data: CREATE_INTERNAL_USER_TYPE,
	) => Promise<Result<InternalUser, null>>
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
	FindBy,
}
