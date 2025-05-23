import { z } from 'zod'

const LOGIN_SCHEMA = z
	.object({
		email: z.string().email(),
		password: z.string(),
	})
	.strict()

type LOGIN_TYPE = z.infer<typeof LOGIN_SCHEMA>

const EMAIL_VERIFICATION_SCHEMA = z.object({
	code: z.string().length(4),
})

type EMAIL_VERIFICATION_TYPE = z.infer<typeof EMAIL_VERIFICATION_SCHEMA>

export { LOGIN_SCHEMA, EMAIL_VERIFICATION_SCHEMA }
export type { LOGIN_TYPE, EMAIL_VERIFICATION_TYPE }
