import { z } from 'zod'

const GET_USER_PARAMS_SCHEMA = z.object({
	id: z.string().uuid(),
})

type GET_USER_PARAMS_TYPE = z.infer<typeof GET_USER_PARAMS_SCHEMA>

export { GET_USER_PARAMS_SCHEMA }
export type { GET_USER_PARAMS_TYPE }
