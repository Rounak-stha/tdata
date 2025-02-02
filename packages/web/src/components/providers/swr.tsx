'use client'

import { toast } from 'sonner'
import { SWRConfig } from 'swr'

const fetcher = async (url: string) => {
	const res = await fetch(url)
	if (!res.ok) {
		const error = new Error('An error occurred while fetching')
		const err = await res.json()
		error.message = err.message
		toast.error(error.message)
		throw error
	}
	const apiReturn = await res.json()
	return apiReturn.data
}

export const SWRProvider = ({ children }: { children: React.ReactNode }) => {
	return <SWRConfig value={{ fetcher }}>{children}</SWRConfig>
}
