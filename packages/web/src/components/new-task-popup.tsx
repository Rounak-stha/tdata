'use client'

import * as React from 'react'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Editor } from '@tdata/editor'
import { Avatar } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { StatusSelect } from '@components/selects/status'
import { PrioritySelect } from '@components/selects/priority'
import { AssigneeSelect } from '@components/selects/assignee'
import { Priority, Status } from '@/types/kanban'

interface NewTaskPopupProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	parentTaskId?: string
	parentTaskTitle?: string
	status?: Status
	priority?: Priority
}

export function NewTaskPopup({
	open,
	onOpenChange,
	parentTaskId,
	parentTaskTitle,
	status,
	priority
}: NewTaskPopupProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<VisuallyHidden>
				<DialogTitle>New Task Dialog</DialogTitle>
			</VisuallyHidden>
			<DialogContent className='sm:max-w-[800px] bg-[#1E1E1E] border p-0'>
				<div className='flex flex-col h-[90vh]'>
					<DialogHeader className='p-4 border-b flex-shrink-0'>
						<div className='flex items-center justify-between'>
							<div className='flex items-center gap-2'>
								<Avatar src='/placeholder.svg' />
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
								className='bg-input border placeholder:text-gray-500 focus-visible:ring-ring'
							/>
							<Editor />
						</div>
					</ScrollArea>

					<div className='flex items-center gap-2 p-4 border-t overflow-x-auto flex-shrink-0'>
						<ScrollArea className='w-full'>
							<div className='flex gap-2'>
								<StatusSelect status={status} />
								<PrioritySelect priority={priority} />
								<AssigneeSelect />
								<Button
									variant='outline'
									size='sm'
									className='h-7 bg-[#2A2A2A] text-gray-100 border hover:bg-gray-800 hover:text-gray-100 whitespace-nowrap'
								>
									{parentTaskId}
								</Button>
							</div>
						</ScrollArea>
					</div>

					<DialogFooter className='p-4 border-t flex-shrink-0'>
						<div className='flex items-center gap-2 ml-auto'>
							<Button variant='ghost' onClick={() => onOpenChange(false)}>
								Discard
							</Button>
							<Button>Save</Button>
						</div>
					</DialogFooter>
				</div>
			</DialogContent>
		</Dialog>
	)
}
