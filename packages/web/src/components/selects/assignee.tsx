import { CheckIcon, UserIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Avatar } from '@/components/ui/avatar'
import { useMemo, useState } from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@components/ui/tooltip'

const assignees = [
	{ id: 'USER-1', name: 'Alice', avatar: '/placeholder.svg?height=32&width=32' },
	{ id: 'USER-2', name: 'Bob', avatar: '/placeholder.svg?height=32&width=32' },
	{ id: 'USER-3', name: 'Charlie', avatar: '/placeholder.svg?height=32&width=32' }
]

interface AssigneeSelectProps {
	assigneeId?: string
	onSelect?: (value: string) => void
	type?: 'icon' | 'default'
}

export function AssigneeSelect({ assigneeId, onSelect, type = 'default' }: AssigneeSelectProps) {
	const [open, setOpen] = useState(false)
	const initialAssignee = useMemo(() => assignees.find((a) => a.id === assigneeId), [assigneeId])
	const [selectedAssignee, setSelectedAssignee] = useState(initialAssignee)

	const handleSelect = (id: string) => {
		const assignee = assignees.find((a) => a.id === id)
		setSelectedAssignee(assignee)
		setOpen(false)
		if (onSelect) onSelect(id)
	}

	return (
		<TooltipProvider>
			<Tooltip>
				<Popover open={open} onOpenChange={setOpen}>
					<TooltipTrigger asChild>
						<PopoverTrigger asChild>
							<Button
								variant='ghost'
								role='combobox'
								aria-expanded={open}
								className='w-fit p-0 px-2 flex items-center justify-center bg-inherit'
							>
								{selectedAssignee ? (
									<>
										<Avatar src={selectedAssignee.avatar} alt={`${selectedAssignee.name} avatar`} />
										{type == 'default' && <span className='ml-1'>{selectedAssignee.name}</span>}
									</>
								) : (
									<>
										<UserIcon className='h-6 w-6' />
										{type == 'default' && <span className='ml-1'>Assign</span>}
									</>
								)}
							</Button>
						</PopoverTrigger>
					</TooltipTrigger>
					<TooltipContent>{selectedAssignee ? selectedAssignee.name : 'Assign task'}</TooltipContent>
					<PopoverContent align='end' className='w-[200px] p-0'>
						<Command>
							<CommandInput placeholder='Search assignee...' />
							<CommandEmpty>No assignee found.</CommandEmpty>
							<CommandList>
								<CommandGroup>
									{assignees.map((assignee) => (
										<CommandItem
											key={assignee.id}
											onSelect={() => handleSelect(assignee.id)}
											value={assignee.name}
										>
											<Avatar src={assignee.avatar} alt={`${assignee.name} avatar`} />
											{assignee.name}
											<CheckIcon
												className={cn(
													'ml-auto h-4 w-4',
													selectedAssignee?.id === assignee.id ? 'opacity-100' : 'opacity-0'
												)}
											/>
										</CommandItem>
									))}
								</CommandGroup>
							</CommandList>
						</Command>
					</PopoverContent>
				</Popover>
			</Tooltip>
		</TooltipProvider>
	)
}
