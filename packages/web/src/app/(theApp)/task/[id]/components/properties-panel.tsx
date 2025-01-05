import { AssigneeSelect } from '@/components/selects/assignee'
import { PrioritySelect } from '@/components/selects/priority'
import { StatusSelect } from '@/components/selects/status'

export const PropertiesPanel = () => {
	return (
		<div className='space-y-6'>
			<h3 className='text-sm font-medium'>Properties</h3>

			<div className='space-y-4'>
				<div className='space-y-1'>
					<label className='text-sm text-muted-foreground'>Status</label>
					<StatusSelect status='Backlog' />
				</div>
				<div className='space-y-1'>
					<label className='text-sm text-muted-foreground'>Priority</label>
					<PrioritySelect priority='LOW' />
				</div>
				<div className='space-y-1'>
					<label className='text-sm text-muted-foreground'>Assignee</label>
					<AssigneeSelect />
				</div>
			</div>
		</div>
	)
}
