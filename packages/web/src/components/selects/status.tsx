import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { IconColorMap, IconMap } from '@/lib/constants/icon'
import { IconType } from '@/types/icon'
import { useOrganizationStatus } from '@/hooks'
import { WorkflowStatus } from '@/types/workflow'

/**
 * TODO:
 * Since we want the Status (Workflow) to be fully custimizable, we also want the user to be able to select icons for each status.
 * We want to limit the number of custom WF Status to be 10 to make it manageable
 * Also, we want to provide a default set of icons for the user to choose from
 * Currently, we don;t have the ability to add custom icons
 */
const statusIcons = IconMap

const statusColors = IconColorMap

interface StatusSelectProps {
	status?: WorkflowStatus
	onChange?: (status: WorkflowStatus) => void
	type?: 'icon' | 'default'
}

export function StatusSelect({ status: InitialStatus, onChange, type = 'default' }: StatusSelectProps) {
	const organizationStatuses = useOrganizationStatus()
	const [status, setStatus] = useState(InitialStatus || organizationStatuses[0])
	const Icon = statusIcons[status.icon as IconType]

	const handleChange = (statusId: string) => {
		const newStatus = organizationStatuses.find((s) => s.id === Number(statusId))!
		setStatus(newStatus)
		if (onChange) onChange(newStatus)
	}
	return (
		<Select value={String(status.id)} onValueChange={handleChange}>
			<SelectTrigger
				className={cn('w-fit h-8 p-0 px-2 flex items-center justify-center', {
					'[&>svg]:mt-0.5': type == 'default',
					'[&>svg]:hidden': type == 'icon'
				})}
			>
				<SelectValue asChild>
					<p className={cn('flex items-center space-x-2', { 'mr-2': type == 'default' })}>
						<Icon className={`h-4 w-4 ${statusColors[status.icon as IconType]}`} />
						{type == 'default' && <span className='text-sm'>{status.name}</span>}
					</p>
				</SelectValue>
			</SelectTrigger>
			<SelectContent>
				{organizationStatuses.map((status) => {
					const IcomComp = statusIcons[status.icon as IconType]
					return (
						<SelectItem key={status.id} value={String(status.id)}>
							<div className='flex items-center'>
								<IcomComp className={`mr-2 h-4 w-4 ${statusColors[status.icon as IconType]}`} />
								{status.name.charAt(0) + status.name.slice(1).toLowerCase().replace('_', ' ')}
							</div>
						</SelectItem>
					)
				})}
			</SelectContent>
		</Select>
	)
}
