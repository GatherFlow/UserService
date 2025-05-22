import { asClass, asFunction } from 'awilix'
import type { AuthDiConfig } from './types/index.js'
import { PasswordService } from './services/PasswordService.js'
import type { CommonDependencies } from '@/core/types/deps.js'
import { Throttler } from '@/core/lib/throttler.js'
import { LOGIN_THROTTLER_KEY } from './constants/index.js'
import { CookieService } from './services/CookieService.js'
import { EmailVerificationService } from './services/EmailVerificationService.js'

export const resolveAuthModule = (): AuthDiConfig => ({
	cookieService: asClass(CookieService).singleton(),
	passwordService: asClass(PasswordService).singleton(),
	loginThrottler: asFunction(({ cache }: CommonDependencies) => {
		const throttler = new Throttler<string>({ key: LOGIN_THROTTLER_KEY, cache })

		return throttler
	}).singleton(),
	emailVerificationService: asClass(EmailVerificationService).singleton(),
})
