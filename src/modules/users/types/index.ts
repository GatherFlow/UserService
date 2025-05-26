import type { Result } from '@/core/lib/result.js'
import type { BaseDiConfig, InjectableDependencies } from '@/core/types/deps.js'
import type { Maybe } from '@/core/types/index.js'
import type {
	ExternalUser,
	InternalCredentials,
	InternalUser,
	Language,
	PublicUser,
	User,
	UserLanguage,
	UserPrivacy,
} from '@/db/types.js'
import type {
	CREATE_EXTERNAL_USER_TYPE,
	CREATE_INTERNAL_USER_TYPE,
	EDIT_USER_PROFILE_TYPE,
	MANAGE_PRIVACY_TYPE,
} from '../schemas/index.js'

type InternalFindBy = 'id' | 'email'

type ExternalFindBy = 'id' | 'providerId'

interface IUsersRepository {
	findAll: () => Promise<User[]>
	findInternalBy: <K extends InternalFindBy>(
		by: K,
		value: InternalCredentials[K],
	) => Promise<Maybe<InternalUser>>
	findExternalBy: <K extends ExternalFindBy>(
		by: K,
		value: ExternalUser[K],
	) => Promise<Maybe<ExternalUser>>
	createInternal: (
		data: CREATE_INTERNAL_USER_TYPE,
	) => Promise<Result<InternalUser, null>>
	createExternal: (
		data: CREATE_EXTERNAL_USER_TYPE,
	) => Promise<Result<ExternalUser, null>>
	changePassword: (userId: string, password: string) => Promise<void>
}

interface IProfilesRepository {
	getPrivacy: (id: string) => Promise<UserPrivacy>
	getLanguage: (id: string) => Promise<UserLanguage>
	changeLanguage: (userId: string, language: Language) => Promise<void>
	managePrivacy: (userId: string, data: MANAGE_PRIVACY_TYPE) => Promise<void>
	editProfile: (userId: string, data: EDIT_USER_PROFILE_TYPE) => Promise<void>
	verify: (userId: string) => Promise<void>
}

interface IUsersService {
	getCurrent: (id: string) => Promise<Maybe<PublicUser>>
}

interface ICredentialsService {
	isEmailAvailable: (email: string) => Promise<boolean>
	isUsernameAvailable: (username: string) => Promise<boolean>
}

interface UsersModuleDependencies {
	usersRepository: IUsersRepository
	profilesRepository: IProfilesRepository
	usersService: IUsersService
	credentialsService: ICredentialsService
}

type UsersInjectableDependencies =
	InjectableDependencies<UsersModuleDependencies>

type UsersDiConfig = BaseDiConfig<UsersModuleDependencies>

export type {
	ExternalFindBy,
	IProfilesRepository,
	IUsersRepository,
	InternalFindBy,
	UsersDiConfig,
	UsersInjectableDependencies,
	UsersModuleDependencies,
	IUsersService,
	ICredentialsService,
}
