export const PathPrefix = {
	api: '/api',
	auth: '/auth'
} as const

export const Paths = {
	root: '/',
	signin: `${PathPrefix.auth}/signin`,
	onboarding: '/onboarding'
} as const
