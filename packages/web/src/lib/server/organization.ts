import OrganizationRepository from '@/repositories/organization'
import { CustomError } from '@lib/error'

export async function getOrganizationByUserAndKey(userId: string, organizationKey: string) {
	const result = await OrganizationRepository.getByKeyIfUserIsMember(organizationKey, userId)

	if (!result) throw new CustomError('404- Organization not found')
	return result
}

export async function getOrganizationMembers(organizationId: number) {
	return await OrganizationRepository.getMembers(organizationId)
}
