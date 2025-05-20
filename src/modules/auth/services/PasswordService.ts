import type { IPasswordService } from '../types/index.js'
import { hash, verify } from '@node-rs/argon2'

export class PasswordService implements IPasswordService {
	private static readonly HASHING_PARAMS = {
		memoryCost: 19456,
		timeCost: 2,
		outputLen: 32,
		parallelism: 1,
	} as const

	async generateHash(password: string): Promise<string> {
		return hash(password, PasswordService.HASHING_PARAMS)
	}

	async verify(hash: string, password: string): Promise<boolean> {
		return verify(hash, password, PasswordService.HASHING_PARAMS)
	}
}
