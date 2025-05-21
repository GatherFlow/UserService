import { LOGIN_SCHEMA } from '@/modules/auth/schema/index.js'
import { z } from 'zod'

const CREATE_INTERNAL_USER_SCHEMA = LOGIN_SCHEMA.extend({
	firstName: z.string().min(2).max(50),
	lastName: z.string().min(2).max(50),
	language: z.enum(['en', 'uk']),
}).strict()

type CREATE_INTERNAL_USER_TYPE = z.infer<typeof CREATE_INTERNAL_USER_SCHEMA>

export { CREATE_INTERNAL_USER_SCHEMA }
export type { CREATE_INTERNAL_USER_TYPE }
