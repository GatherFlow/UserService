import type { NonOptionalKeys } from '../types/object.js'

export const omitOptionalKeys = <T extends object>(
	obj: Partial<T>,
): Pick<T, NonOptionalKeys<T>> => {
	const result: Partial<T> = {}

	for (const key in obj) {
		if (obj[key] !== undefined) {
			result[key] = obj[key]
		}
	}

	return result as Pick<T, NonOptionalKeys<T>>
}
