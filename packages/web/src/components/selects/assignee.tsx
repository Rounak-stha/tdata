import { CheckIcon, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useState } from 'react'

const assignees = [
	{ id: 'USER-1', name: 'Alice', avatar: '/placeholder.svg?height=32&width=32' },
	{ id: 'USER-2', name: 'Bob', avatar: '/placeholder.svg?height=32&width=32' },
	{ id: 'USER-3', name: 'Charlie', avatar: '/placeholder.svg?height=32&width=32' }
]

interface AssigneeSelectProps {
	value?: string
	onSelect: (value: string) => void
}

export function AssigneeSelect({ value, onSelect }: AssigneeSelectProps) {
	const [open, setOpen] = useState(false)
	const selectedAssignee = assignees.find((a) => a.id === value)

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button variant='ghost' role='combobox' aria-expanded={open} className='p-0 hover:bg-transparent'>
					{selectedAssignee ? (
						<Avatar className='h-6 w-6'>
							<AvatarImage src={selectedAssignee.avatar} alt={selectedAssignee.name} />
							<AvatarFallback>{selectedAssignee.name[0]}</AvatarFallback>
						</Avatar>
					) : (
						<User className='h-4 w-4' />
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent align='end' className='w-[200px] p-0'>
				<Command>
					<CommandInput placeholder='Search assignee...' />
					<CommandEmpty>No assignee found.</CommandEmpty>
					<CommandList>
						<CommandGroup>
							{assignees.map((assignee) => (
								<CommandItem
									key={assignee.id}
									onSelect={() => {
										onSelect(assignee.id === value ? '' : assignee.id)
										setOpen(false)
									}}
								>
									<Avatar className='h-6 w-6 mr-1'>
										<AvatarImage src={assignee.avatar} alt={assignee.name} />
										<AvatarFallback>{assignee.name[0]}</AvatarFallback>
									</Avatar>
									{assignee.name}
									<CheckIcon
										className={cn(
											'ml-auto h-4 w-4',
											value === assignee.id ? 'opacity-100' : 'opacity-0'
										)}
									/>
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	)
}
