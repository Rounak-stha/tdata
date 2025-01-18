export const PathPrefix = {
	api: '/api',
	auth: '/auth'
} as const

export const Paths = {
	root: '/',
	signin: `${PathPrefix.auth}/signin`,
	onboarding: '/onboarding',
	error: '/error',
	task: (org: string, taskNumber: string) => `/${org}/task/${taskNumber}`
} as const
