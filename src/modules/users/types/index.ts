import type { Maybe } from '@/core/types/index.js'
import type { BaseDiConfig, InjectableDependencies } from '@/core/types/deps.js'
import type {
	InternalCredentials,
	InternalUser,
	Language,
	PublicUser,
	User,
	UserLanguage,
	UserPrivacy,
} from '@/db/types.js'
import type {
	CREATE_INTERNAL_USER_TYPE,
	EDIT_USER_PROFILE_TYPE,
	MANAGE_PRIVACY_TYPE,
} from '../schemas/index.js'
import type { Result } from '@/core/lib/result.js'

type FindBy = 'id' | 'email'

interface IUsersRepository {
	findAll: () => Promise<User[]>
	findInternalBy: <K extends FindBy>(
		by: K,
		value: InternalCredentials[K],
	) => Promise<Maybe<InternalUser>>
	getCurrent: (id: string) => Promise<Maybe<PublicUser>>
	getUserPrivacy: (id: string) => Promise<UserPrivacy>
	getUserLanguage: (id: string) => Promise<UserLanguage>
	isEmailAvailable: (email: string) => Promise<boolean>
	isUsernameAvailable: (username: string) => Promise<boolean>
	createInternal: (
		data: CREATE_INTERNAL_USER_TYPE,
	) => Promise<Result<InternalUser, null>>
	changeLanguage: (userId: string, language: Language) => Promise<void>
	managePrivacy: (userId: string, data: MANAGE_PRIVACY_TYPE) => Promise<void>
	editProfile: (userId: string, data: EDIT_USER_PROFILE_TYPE) => Promise<void>
	verify: (userId: string) => Promise<void>
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
