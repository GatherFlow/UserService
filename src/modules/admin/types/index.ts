import type { BaseDiConfig, InjectableDependencies } from '@/core/types/deps.js'
import type { AdminUser } from '@/db/types.js'

interface IAdminRepository {
	getUsers: () => Promise<AdminUser[]>
}

interface AdminModuleDependencies {
	adminRepository: IAdminRepository
}

type AdminInjectableDependencies =
	InjectableDependencies<AdminModuleDependencies>

type AdminDiConfig = BaseDiConfig<AdminModuleDependencies>

export type {
	AdminDiConfig,
	AdminInjectableDependencies,
	AdminModuleDependencies,
	IAdminRepository,
}
