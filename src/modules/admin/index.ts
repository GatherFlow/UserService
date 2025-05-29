import { asClass } from 'awilix'
import type { AdminDiConfig } from './types/index.js'
import { AdminRepository } from './repositories/AdminRepository.js'

export const resolveAdminModule = (): AdminDiConfig => ({
	adminRepository: asClass(AdminRepository).singleton(),
})
