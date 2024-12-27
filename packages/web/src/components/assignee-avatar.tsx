import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { CheckIcon, User } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Assignee {
	id: string
	name: string
	avatar?: string
	email?: string
}

interface AssigneeAvatarProps {
	assignee?: Assignee
	onAssigneeChange: (assigneeId: string) => void
	size?: 'sm' | 'md'
}

const assignees = [
	{ id: 'USER-1', name: 'Alice', avatar: '/placeholder.svg?height=32&width=32', email: 'alice@example.com' },
	{ id: 'USER-2', name: 'Bob', avatar: '/placeholder.svg?height=32&width=32', email: 'bob@example.com' },
	{ id: 'USER-3', name: 'Charlie', avatar: '/placeholder.svg?height=32&width=32', email: 'charlie@example.com' }
]

export function AssigneeAvatar({ assignee, onAssigneeChange, size = 'md' }: AssigneeAvatarProps) {
	const avatarSize = size === 'sm' ? 'h-6 w-6' : 'h-8 w-8'

	return (
		<TooltipProvider>
			<Tooltip>
				<Popover>
					<TooltipTrigger asChild>
						<PopoverTrigger asChild>
							<button className='rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'>
								<Avatar className={`${avatarSize} cursor-pointer`}>
									{assignee ? (
										<>
											<AvatarImage src={assignee.avatar} alt={assignee.name} />
											<AvatarFallback>{assignee.name[0]}</AvatarFallback>
										</>
									) : (
										<User className='h-4 w-4' />
									)}
								</Avatar>
							</button>
						</PopoverTrigger>
					</TooltipTrigger>
					<TooltipContent>{assignee ? assignee.name : 'Assign task'}</TooltipContent>
					<PopoverContent className='w-[200px] p-0'>
						<Command>
							<CommandInput placeholder='Search assignee...' />
							<CommandEmpty>No assignee found.</CommandEmpty>
							<CommandList>
								<CommandGroup>
									{assignees.map((a) => (
										<CommandItem
											key={a.id}
											onSelect={() => onAssigneeChange(a.id === assignee?.id ? '' : a.id)}
										>
											<Avatar className='h-6 w-6 mr-2'>
												<AvatarImage src={a.avatar} />
												<AvatarFallback>{a.name[0]}</AvatarFallback>
											</Avatar>
											<span>{a.name}</span>
											<CheckIcon
												className={cn(
													'ml-auto h-4 w-4',
													assignee?.id === a.id ? 'opacity-100' : 'opacity-0'
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
