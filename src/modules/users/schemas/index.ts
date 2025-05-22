import { LOGIN_SCHEMA } from '@/modules/auth/schema/index.js'
import { z } from 'zod'

const LANGUAGE_ENUM_SCHEMA = z.enum(['en', 'uk'])

const CREATE_INTERNAL_USER_SCHEMA = LOGIN_SCHEMA.extend({
	firstName: z.string().min(2).max(50),
	lastName: z.string().min(2).max(50),
	language: LANGUAGE_ENUM_SCHEMA,
}).strict()

type CREATE_INTERNAL_USER_TYPE = z.infer<typeof CREATE_INTERNAL_USER_SCHEMA>

const CHANGE_LANGUAGE_SCHEMA = z
	.object({
		language: LANGUAGE_ENUM_SCHEMA,
	})
	.strict()

type CHANGE_LANGUAGE_TYPE = z.infer<typeof CHANGE_LANGUAGE_SCHEMA>

const MANAGE_PRIVACY_SCHEMA = z
	.object({
		isProfile: z.boolean().optional(),
		hideOwned: z.boolean().optional(),
		hidePurchased: z.boolean().optional(),
		hideAppreciated: z.boolean().optional(),
	})
	.strict()

type MANAGE_PRIVACY_TYPE = z.infer<typeof MANAGE_PRIVACY_SCHEMA>

export {
	CREATE_INTERNAL_USER_SCHEMA,
	CHANGE_LANGUAGE_SCHEMA,
	MANAGE_PRIVACY_SCHEMA,
}
export type {
	CREATE_INTERNAL_USER_TYPE,
	CHANGE_LANGUAGE_TYPE,
	MANAGE_PRIVACY_TYPE,
}
