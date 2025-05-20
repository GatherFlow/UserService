import { z } from 'zod'

const LOGIN_SCHEMA = z
	.object({
		email: z.string().email(),
		password: z.string(),
	})
	.strict()

type LOGIN_TYPE = z.infer<typeof LOGIN_SCHEMA>

export { LOGIN_SCHEMA }
export type { LOGIN_TYPE }
