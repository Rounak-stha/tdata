'use client' // Error boundaries must be Client Components

import { useEffect } from 'react'

export default function Error({ error }: { error: Error & { digest?: string }; reset: () => void }) {
	useEffect(() => {
		// Log the error to an error reporting service
		console.error(error)
	}, [error])

	return (
		<div>
			<h2>{error.name == 'custom' ? error.message : 'SOmething went wrong'}</h2>
		</div>
	)
}
