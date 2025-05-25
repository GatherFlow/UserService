import { z } from 'zod'

const LOGIN_SCHEMA = z
	.object({
		email: z.string().email(),
		password: z.string(),
	})
	.strict()

type LOGIN_TYPE = z.infer<typeof LOGIN_SCHEMA>

const EMAIL_VERIFICATION_SCHEMA = z
	.object({
		code: z.string().length(4),
	})
	.strict()

type EMAIL_VERIFICATION_TYPE = z.infer<typeof EMAIL_VERIFICATION_SCHEMA>

const REQUEST_PASSWORD_RESET_SCHEMA = z
	.object({
		email: z.string().email(),
	})
	.strict()

type REQUEST_PASSWORD_RESET_TYPE = z.infer<typeof REQUEST_PASSWORD_RESET_SCHEMA>

const PASSWORD_RESET_SCHEMA = z.object({
	password: z.string(),
})

type PASSWORD_RESET_TYPE = z.infer<typeof PASSWORD_RESET_SCHEMA>

export {
	LOGIN_SCHEMA,
	EMAIL_VERIFICATION_SCHEMA,
	REQUEST_PASSWORD_RESET_SCHEMA,
	PASSWORD_RESET_SCHEMA,
}
export type {
	LOGIN_TYPE,
	EMAIL_VERIFICATION_TYPE,
	REQUEST_PASSWORD_RESET_TYPE,
	PASSWORD_RESET_TYPE,
}
