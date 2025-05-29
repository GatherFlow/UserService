import type {
	CommonDependencies,
	ExternalDependencies,
} from '@/core/types/deps.js'
import { resolveAdminModule } from '@/modules/admin/index.js'
import type { AdminModuleDependencies } from '@/modules/admin/types/index.js'
import { resolveAuthModule } from '@/modules/auth/index.js'
import type { AuthModuleDependencies } from '@/modules/auth/types/index.js'
import { resolveUsersModule } from '@/modules/users/index.js'
import type { UsersModuleDependencies } from '@/modules/users/types/index.js'
import type { AwilixContainer, NameAndRegistrationPair } from 'awilix'
import { resolveCommonDiConfig } from './commonDiConfig.js'
import type { StatisticModuleDependencies } from '@/modules/statictics/types/index.js'
import { resolveStatisticsModule } from '@/modules/statictics/index.js'

type Dependencies = CommonDependencies &
	UsersModuleDependencies &
	AuthModuleDependencies &
	AdminModuleDependencies &
	StatisticModuleDependencies

type DiConfig = NameAndRegistrationPair<Dependencies>

export const registerDependencies = (
	diContainer: AwilixContainer,
	dependencies: ExternalDependencies,
) => {
	const diConfig: DiConfig = {
		...resolveCommonDiConfig(dependencies),
		...resolveUsersModule(),
		...resolveAuthModule(),
		...resolveAdminModule(),
		...resolveStatisticsModule(),
	}

	diContainer.register(diConfig)
}

declare module '@fastify/awilix' {
	// eslint-disable-next-line @typescript-eslint/no-empty-object-type
	interface Cradle extends Dependencies {}

	// eslint-disable-next-line @typescript-eslint/no-empty-object-type
	interface RequestCradle extends Dependencies {}
}
