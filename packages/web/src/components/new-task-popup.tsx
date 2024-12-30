'use client'

import * as React from 'react'
import { Calendar, Users, Tag, ChevronDown } from 'lucide-react'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Editor } from '@tdata/editor'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'

interface NewTaskPopupProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	parentTaskId: string
	parentTaskTitle: string
}

const statusOptions = [
	{ label: 'Backlog', value: 'backlog', color: 'bg-gray-500' },
	{ label: 'Todo', value: 'todo', color: 'bg-blue-500' },
	{ label: 'In Progress', value: 'in-progress', color: 'bg-yellow-500' },
	{ label: 'Done', value: 'done', color: 'bg-green-500' }
]

const priorityOptions = [
	{ label: 'No Priority', value: 'none', icon: '◯' },
	{ label: 'Urgent', value: 'urgent', icon: '🔴' },
	{ label: 'High', value: 'high', icon: '🟠' },
	{ label: 'Medium', value: 'medium', icon: '🟡' },
	{ label: 'Low', value: 'low', icon: '🟢' }
]

export function NewTaskPopup({ open, onOpenChange, parentTaskId, parentTaskTitle }: NewTaskPopupProps) {
	const [status, setStatus] = React.useState(statusOptions[0])
	const [priority, setPriority] = React.useState(priorityOptions[0])

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<VisuallyHidden>
				<DialogTitle>New Task Dialog</DialogTitle>
			</VisuallyHidden>
			<DialogContent className='sm:max-w-[800px] bg-[#1E1E1E] border-gray-800 text-gray-100 p-0'>
				<div className='flex flex-col h-[90vh]'>
					<DialogHeader className='p-4 border-b border-gray-800 flex-shrink-0'>
						<div className='flex items-center justify-between'>
							<div className='flex items-center gap-2'>
								<Avatar className='h-5 w-5'>
									<AvatarImage src='/placeholder.svg' />
									<AvatarFallback>R</AvatarFallback>
								</Avatar>
								<span className='text-sm font-medium text-gray-100'>Rstha Project</span>
							</div>
						</div>
						<div className='flex items-center gap-2 mt-2 text-sm text-gray-400'>
							<span>{parentTaskId}</span>
							<span>{parentTaskTitle}</span>
						</div>
					</DialogHeader>

					<ScrollArea className='flex-grow'>
						<div className='p-4 space-y-4'>
							<Input
								placeholder='Title'
								className='bg-[#2A2A2A] border-gray-800 text-gray-100 placeholder:text-gray-500 focus-visible:ring-gray-700'
							/>
							<Editor />
						</div>
					</ScrollArea>

					<div className='flex items-center gap-2 p-4 border-t border-gray-800 overflow-x-auto flex-shrink-0'>
						<ScrollArea className='w-full'>
							<div className='flex gap-2'>
								<Popover>
									<PopoverTrigger asChild>
										<Button
											variant='outline'
											size='sm'
											className='h-7 bg-[#2A2A2A] text-gray-100 border-gray-800 hover:bg-gray-800 hover:text-gray-100 whitespace-nowrap'
										>
											<span className={`w-2 h-2 rounded-full mr-2 ${status.color}`} />
											{status.label}
											<ChevronDown className='ml-2 h-4 w-4' />
										</Button>
									</PopoverTrigger>
									<PopoverContent className='w-[200px] p-0 bg-[#2A2A2A] border-gray-800'>
										<Command>
											<CommandInput placeholder='Search status...' className='h-9' />
											<CommandEmpty>No status found.</CommandEmpty>
											<CommandList>
												<CommandGroup>
													{statusOptions.map((option) => (
														<CommandItem
															key={option.value}
															onSelect={() => setStatus(option)}
															className='flex items-center gap-2 px-2 py-1.5 text-gray-100 hover:bg-gray-800'
														>
															<span className={`w-2 h-2 rounded-full ${option.color}`} />
															{option.label}
														</CommandItem>
													))}
												</CommandGroup>
											</CommandList>
										</Command>
									</PopoverContent>
								</Popover>
								<Popover>
									<PopoverTrigger asChild>
										<Button
											variant='outline'
											size='sm'
											className='h-7 bg-[#2A2A2A] text-gray-100 border-gray-800 hover:bg-gray-800 hover:text-gray-100 whitespace-nowrap'
										>
											{priority.icon} {priority.label}
											<ChevronDown className='ml-2 h-4 w-4' />
										</Button>
									</PopoverTrigger>
									<PopoverContent className='w-[200px] p-0 bg-[#2A2A2A] border-gray-800'>
										<Command>
											<CommandInput placeholder='Search priority...' className='h-9' />
											<CommandEmpty>No priority found.</CommandEmpty>
											<CommandList>
												<CommandGroup>
													{priorityOptions.map((option) => (
														<CommandItem
															key={option.value}
															onSelect={() => setPriority(option)}
															className='flex items-center gap-2 px-2 py-1.5 text-gray-100 hover:bg-gray-800'
														>
															{option.icon} {option.label}
														</CommandItem>
													))}
												</CommandGroup>
											</CommandList>
										</Command>
									</PopoverContent>
								</Popover>
								<Button
									variant='outline'
									size='sm'
									className='h-7 bg-[#2A2A2A] text-gray-100 border-gray-800 hover:bg-gray-800 hover:text-gray-100 whitespace-nowrap'
								>
									<Users className='h-4 w-4 mr-1' />
									Assignees
								</Button>
								<Button
									variant='outline'
									size='sm'
									className='h-7 bg-[#2A2A2A] text-gray-100 border-gray-800 hover:bg-gray-800 hover:text-gray-100 whitespace-nowrap'
								>
									<Tag className='h-4 w-4 mr-1' />
									Labels
								</Button>
								<Button
									variant='outline'
									size='sm'
									className='h-7 bg-[#2A2A2A] text-gray-100 border-gray-800 hover:bg-gray-800 hover:text-gray-100 whitespace-nowrap'
								>
									<Calendar className='h-4 w-4 mr-1' />
									Due date
								</Button>
								<Button
									variant='outline'
									size='sm'
									className='h-7 bg-[#2A2A2A] text-gray-100 border-gray-800 hover:bg-gray-800 hover:text-gray-100 whitespace-nowrap'
								>
									{parentTaskId}
								</Button>
							</div>
						</ScrollArea>
					</div>

					<DialogFooter className='p-4 border-t border-gray-800 flex-shrink-0'>
						<div className='flex items-center gap-2 ml-auto'>
							<Button
								variant='ghost'
								onClick={() => onOpenChange(false)}
								className='text-gray-400 hover:text-gray-100 hover:bg-gray-800'
							>
								Discard
							</Button>
							<Button className='bg-blue-600 hover:bg-blue-700 text-white'>Save</Button>
						</div>
					</DialogFooter>
				</div>
			</DialogContent>
		</Dialog>
	)
}
