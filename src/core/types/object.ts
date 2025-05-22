type NonOptionalKeys<T extends object> = {
	[K in keyof T]-?: undefined extends T[K] ? never : K
}[keyof T]

export type { NonOptionalKeys }
