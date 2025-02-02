import { ProjectTemplateDetail } from '@/types'
import useSWR from 'swr'

export const useProjectTemplate = (projectId: number) => {
	const { data, isLoading } = useSWR<ProjectTemplateDetail>(`/api/project/${projectId}/template`, null, {
		revalidateOnFocus: false
	})
	return { data, isLoading }
}
