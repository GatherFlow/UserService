import { asClass } from 'awilix'
import { UsersRepository } from './repositories/UsersRepository.js'
import type { UsersDiConfig } from './types/index.js'
import { ProfilesRepository } from './repositories/ProfilesRepository.js'
import { UsersService } from './services/UsersService.js'
import { CredentialsService } from './services/CredentialsService.js'

export const resolveUsersModule = (): UsersDiConfig => ({
	usersRepository: asClass(UsersRepository).singleton(),
	profilesRepository: asClass(ProfilesRepository).singleton(),
	usersService: asClass(UsersService).singleton(),
	credentialsService: asClass(CredentialsService).singleton(),
})
