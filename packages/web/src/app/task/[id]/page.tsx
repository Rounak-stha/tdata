'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { ArrowLeft, Clock, History, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Editor } from '@tdata/editor'
import { TaskProperties } from '@/components/task-properties'
import { AssigneeAvatar } from '@/components/assignee-avatar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import type { Task } from '@/types/kanban'

export default function TaskDetailsPage() {
	const params = useParams()
	const router = useRouter()
	const [task, setTask] = useState<Task | null>(null)
	const [title, setTitle] = useState('')

	useEffect(() => {
		const mockTask: Task = {
			id: params.id as string,
			title: 'Example Task',
			status: 'TODO',
			priority: 'MEDIUM',
			projectId: 'PROJ-1',
			dueDate: '2024-01-25',
			assignee: {
				id: 'USER-1',
				name: 'Alice',
				avatar: '/placeholder.svg?height=32&width=32',
				email: 'alice@example.com'
			},
			description: '<p>This is an example task description.</p>'
		}
		setTask(mockTask)
		setTitle(mockTask.title)
	}, [params.id])

	if (!task) {
		return <div>Loading...</div>
	}

	const handleUpdate = (updates: Partial<Task>) => {
		setTask((prevTask) => ({ ...prevTask!, ...updates }))
	}

	return (
		<div className='h-full flex flex-col bg-background'>
			<header className='flex items-center px-6 py-3 border-b'>
				<div className='flex-1 flex items-center gap-4'>
					<Button
						variant='ghost'
						size='sm'
						onClick={() => router.back()}
						className='text-muted-foreground hover:text-foreground'
					>
						<ArrowLeft className='h-4 w-4 mr-2' />
						Back
					</Button>
					<span className='text-sm text-muted-foreground font-mono'>{task.id}</span>
				</div>
				<div className='flex items-center gap-2'>
					{task.assignee && <AssigneeAvatar onAssigneeChange={() => {}} assignee={task.assignee} size='md' />}
				</div>
			</header>
			<div className='flex-1 flex overflow-hidden'>
				<main className='flex-1 overflow-y-auto'>
					<div className='max-w-3xl mx-auto px-6 py-4'>
						<Input
							value={title}
							onChange={(e) => {
								setTitle(e.target.value)
								handleUpdate({ title: e.target.value })
							}}
							className='text-2xl font-medium px-0 border-0 bg-transparent focus-visible:ring-0 -mx-0.5 my-1 h-auto'
						/>
						<Tabs defaultValue='content' className='mt-6'>
							<TabsList className='w-full justify-start h-auto p-0 bg-transparent border-b rounded-none'>
								<TabsTrigger
									value='content'
									className='text-sm data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary rounded-none'
								>
									Content
								</TabsTrigger>
								<TabsTrigger
									value='activity'
									className='text-sm data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary rounded-none'
								>
									Activity
								</TabsTrigger>
							</TabsList>
							<TabsContent value='content' className='mt-6'>
								<Editor />
							</TabsContent>
							<TabsContent value='activity' className='mt-6'>
								<div className='space-y-4'>
									<div className='flex items-start gap-3'>
										<Avatar className='h-8 w-8'>
											<AvatarImage src={task.assignee?.avatar} />
											<AvatarFallback>{task.assignee?.name[0]}</AvatarFallback>
										</Avatar>
										<div className='flex-1 space-y-1'>
											<p className='text-sm'>
												<span className='font-medium'>{task.assignee?.name}</span>
												<span className='text-muted-foreground'> created this task</span>
											</p>
											<p className='text-xs text-muted-foreground'>2 hours ago</p>
										</div>
									</div>
								</div>
							</TabsContent>
						</Tabs>
					</div>
				</main>
				<aside className='w-[400px] border-l overflow-y-auto'>
					<div className='p-6 space-y-6'>
						<TaskProperties task={task} onUpdate={handleUpdate} />
						<div>
							<h3 className='text-sm font-medium mb-4'>Activity Overview</h3>
							<div className='space-y-4 text-sm'>
								<div className='flex items-center gap-4 text-muted-foreground'>
									<Clock className='h-4 w-4' />
									<span>Created 2 hours ago</span>
								</div>
								<div className='flex items-center gap-4 text-muted-foreground'>
									<History className='h-4 w-4' />
									<span>Updated 30 minutes ago</span>
								</div>
								<div className='flex items-center gap-4 text-muted-foreground'>
									<MessageSquare className='h-4 w-4' />
									<span>2 comments</span>
								</div>
							</div>
						</div>
					</div>
				</aside>
			</div>
		</div>
	)
}
