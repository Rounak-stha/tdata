import { useContext } from 'react'

import { UserContext } from '@/components/context/user'
import { OrganizationContext } from '@/components/context/organization'

// Custom hook for consuming the context
export const useUser = () => {
	const contextVal = useContext(UserContext)
	if (!contextVal) {
		throw new Error('useUser must be used within a UserProvider')
	}
	return contextVal
}

export const useOrganizations = () => {
	const contextVal = useContext(OrganizationContext)

	if (!contextVal) {
		throw new Error('useOrganizations must be used within a OrganizationProvider')
	}

	return contextVal
}

export const useOrganizationProject = () => {
	const contextVal = useOrganizations()
	if (!contextVal) {
		throw new Error('useOrganizationStatus must be used within a OrganizationProvider')
	}
	return contextVal.organization.projects
}

export const useOrganizationMembers = () => {
	const contextVal = useOrganizations()
	if (!contextVal) {
		throw new Error('useOrganizationMembers must be used within a OrganizationProvider')
	}
	return contextVal.organization.members
}
