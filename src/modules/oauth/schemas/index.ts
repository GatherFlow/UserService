import { z } from 'zod'

const VALIDATE_GOOGLE_CALLBACK_SCHEMA = z.object({
	code: z.string(),
	state: z.string(),
})

type VALIDATE_GOOGLE_CALLBACK_TYPE = z.infer<
	typeof VALIDATE_GOOGLE_CALLBACK_SCHEMA
>

export { VALIDATE_GOOGLE_CALLBACK_SCHEMA }
export type { VALIDATE_GOOGLE_CALLBACK_TYPE }
