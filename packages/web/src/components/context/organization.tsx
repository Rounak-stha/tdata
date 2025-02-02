'use client'

import { createContext, FC, useState } from 'react'
import { OrganizationDetail } from '@/types/organization'

type OrganizationContext = {
	organization: OrganizationDetail
	setOrganization: (organization: OrganizationDetail) => void
}

/**
 * Context to store user data
 * NOTE: The imitial data is empty values, the actual data is set by the provider
 * Context will always be used by components under protected routes
 * For the ease of use by avoiding null check and for cleaner code
 * I am not 100% sure if this approach is correct or safe but I find it quite tedious to always perform a null check everywhere I use the hook
 */
export const OrganizationContext = createContext<OrganizationContext>({
	organization: {
		id: 0,
		name: '',
		imageUrl: '',
		key: '',
		createdAt: new Date(),
		createdBy: '',
		projects: [],
		members: [],
		workflow: {
			id: 0,
			organizationId: 0,
			name: '',
			createdAt: new Date(),
			createdBy: '',
			description: '',
			updatedAt: null,
			deletedAt: null,
			statuses: []
		}
	},
	setOrganization: (organization: OrganizationDetail) => {
		console.log(`${organization}\nFunction not initialized`)
	}
})

type CurrentOrganizationProviderProps = {
	children: React.ReactNode
	initialOrganization: OrganizationDetail
}

// Provider component
export const OrganizationProvider: FC<CurrentOrganizationProviderProps> = ({ children, initialOrganization }) => {
	const [organization, setOrganization] = useState(initialOrganization)

	return (
		<OrganizationContext.Provider value={{ organization, setOrganization }}>
			{children}
		</OrganizationContext.Provider>
	)
}
