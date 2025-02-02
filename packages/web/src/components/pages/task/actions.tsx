'use client'
import { useState } from 'react'

import { LinkIcon, PaperclipIcon, PlusIcon } from 'lucide-react'

import { NewTaskPopup } from '@/components/new-task-popup'
import { Button } from '@/components/ui/button'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'

export const TaskActions = () => {
	const [subIssueDialogOpen, setSubIssueDialogOpen] = useState(false)

	return (
		<>
			<ScrollArea>
				<div className='flex space-x-4'>
					<Button
						variant='outline'
						size='sm'
						className='bg-transparent border-gray-800 hover:bg-gray-800'
						onClick={() => setSubIssueDialogOpen(true)}
					>
						<PlusIcon className='h-4 w-4 mr-2' />
						Add sub-issue
					</Button>
					<Button variant='outline' size='sm' className='bg-transparent border-gray-800 hover:bg-gray-800'>
						<PlusIcon className='h-4 w-4 mr-2' />
						Add relation
					</Button>
					<Button variant='outline' size='sm' className='bg-transparent border-gray-800 hover:bg-gray-800'>
						<LinkIcon className='h-4 w-4 mr-2' />
						Add link
					</Button>
					<Button variant='outline' size='sm' className='bg-transparent border-gray-800 hover:bg-gray-800'>
						<PaperclipIcon className='h-4 w-4 mr-2' />
						Attach
					</Button>
				</div>
				<ScrollBar orientation='horizontal' />
			</ScrollArea>
			<NewTaskPopup
				open={subIssueDialogOpen}
				onOpenChange={setSubIssueDialogOpen}
				parentTaskId='RSTHA-4'
				parentTaskTitle='Task Title'
			/>
		</>
	)
}
