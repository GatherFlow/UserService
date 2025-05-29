import type { Maybe } from '@/core/types/index.js'
import type {
	IProfilesRepository,
	IUsersRepository,
	IUsersService,
	UsersInjectableDependencies,
} from '../types/index.js'
import type { PublicUser } from '@/db/types.js'
import { toPublicUser } from '../utils/index.js'

export class UsersService implements IUsersService {
	private readonly profilesRepository: IProfilesRepository
	private readonly usersRepository: IUsersRepository

	constructor({
		profilesRepository,
		usersRepository,
	}: UsersInjectableDependencies) {
		this.profilesRepository = profilesRepository
		this.usersRepository = usersRepository
	}

	async getCurrent(id: string): Promise<Maybe<PublicUser>> {
		const internalUser = await this.usersRepository.findInternalBy('id', id)

		const language = await this.profilesRepository.getLanguage(id)

		if (!internalUser) {
			const externalUser = await this.usersRepository.findExternalBy('id', id)

			if (!externalUser) return null

			return toPublicUser({ ...externalUser, language: language.language })
		}

		return toPublicUser({ ...internalUser, language: language.language })
	}
}
