import { getRandomValues } from 'node:crypto'

export const generateOTP = (): string => {
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
	const array = new Uint8Array(4)

	getRandomValues(array)

	let result = ''

	for (let i = 0; i < 4; i++) {
		// @ts-expect-error idk
		result += chars[array[i] % chars.length]
	}

	return result
}
