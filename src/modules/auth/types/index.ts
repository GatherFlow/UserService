import type { IThrottler } from '@/core/lib/throttler.js'
import type { BaseDiConfig } from '@/core/types/deps.js'

interface IPasswordService {
	generateHash: (password: string) => Promise<string>
	verify: (hash: string, password: string) => Promise<boolean>
}

interface AuthModuleDependencies {
	passwordService: IPasswordService
	loginThrottler: IThrottler<string>
}

type AuthDiConfig = BaseDiConfig<AuthModuleDependencies>

export type { AuthDiConfig, AuthModuleDependencies, IPasswordService }
