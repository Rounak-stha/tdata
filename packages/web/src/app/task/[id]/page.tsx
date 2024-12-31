'use client'

import { Plus, LinkIcon, Paperclip, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Editor } from '@tdata/editor'
import { ScrollArea } from '@/components/ui/scroll-area'
import React from 'react'
import { NewTaskPopup } from '@/components/new-task-popup'
import { StatusSelect } from '@/components/selects/status'
import { PrioritySelect } from '@/components/selects/priority'
import { AssigneeSelect } from '@/components/selects/assignee'

export default function TaskDetails() {
	const [subIssueDialogOpen, setSubIssueDialogOpen] = React.useState(false)

	return (
		<div className='min-h-screen bg-background text-white'>
			<div className='container py-4'>
				<div className='text-sm text-gray-500 mb-4'>RSTHA-4</div>

				<div className='grid grid-cols-1 md:grid-cols-[1fr,300px] gap-6'>
					{/* Main Content */}
					<div className='space-y-6'>
						<input
							type='text'
							defaultValue='Task Title'
							className='text-2xl font-semibold bg-transparent border-0 w-full focus:outline-none'
						/>

						<Editor />

						<div className='flex space-x-4'>
							<Button
								variant='outline'
								size='sm'
								className='bg-transparent border-gray-800 hover:bg-gray-800'
								onClick={() => setSubIssueDialogOpen(true)}
							>
								<Plus className='h-4 w-4 mr-2' />
								Add sub-issue
							</Button>
							<Button
								variant='outline'
								size='sm'
								className='bg-transparent border-gray-800 hover:bg-gray-800'
							>
								<Plus className='h-4 w-4 mr-2' />
								Add relation
							</Button>
							<Button
								variant='outline'
								size='sm'
								className='bg-transparent border-gray-800 hover:bg-gray-800'
							>
								<LinkIcon className='h-4 w-4 mr-2' />
								Add link
							</Button>
							<Button
								variant='outline'
								size='sm'
								className='bg-transparent border-gray-800 hover:bg-gray-800'
							>
								<Paperclip className='h-4 w-4 mr-2' />
								Attach
							</Button>
						</div>

						<div className='space-y-4'>
							<div className='flex items-center justify-between'>
								<h2 className='text-lg font-semibold'>Activity</h2>
								<div className='flex items-center space-x-2'>
									<Button variant='ghost' size='sm' className='text-gray-400'>
										<RotateCcw className='h-4 w-4' />
									</Button>
									<Button variant='ghost' size='sm' className='text-gray-400'>
										Filters
									</Button>
								</div>
							</div>

							<ScrollArea className='h-[400px]'>
								<div className='space-y-4'>
									{[
										{ type: 'created', time: '4 months ago' },
										{ type: 'label', label: 'labela', time: '10 days ago' },
										{ type: 'label', label: 'ne label', time: '10 days ago' },
										{ type: 'label', label: 'super label', time: '10 days ago' },
										{ type: 'label', label: 'haha', time: '10 days ago' },
										{ type: 'assignee', time: '10 days ago' },
										{ type: 'title', time: '9 days ago' },
										{ type: 'description', time: '9 days ago' }
									].map((activity, i) => (
										<div key={i} className='flex items-start space-x-3 text-sm'>
											<Avatar className='h-6 w-6'>
												<AvatarImage src='/placeholder.svg' />
												<AvatarFallback>R</AvatarFallback>
											</Avatar>
											<div className='flex-1'>
												<div className='flex items-center space-x-2'>
													<span className='font-medium'>rsthaofficial</span>
													{activity.type === 'created' && (
														<span className='text-gray-400'>created the issue</span>
													)}
													{activity.type === 'label' && (
														<>
															<span className='text-gray-400'>added a new label</span>
															<Badge
																variant='outline'
																className='bg-purple-500/10 text-purple-400 border-purple-500/20'
															>
																{activity.label}
															</Badge>
														</>
													)}
													{activity.type === 'assignee' && (
														<span className='text-gray-400'>
															added a new assignee Rsthaofficial
														</span>
													)}
													{activity.type === 'title' && (
														<span className='text-gray-400'>
															set the name to Task Title
														</span>
													)}
													{activity.type === 'description' && (
														<span className='text-gray-400'>updated the description</span>
													)}
													<span className='text-gray-500'>{activity.time}</span>
												</div>
											</div>
										</div>
									))}
								</div>
							</ScrollArea>
						</div>
					</div>

					{/* Properties Sidebar */}
					<div className='space-y-6'>
						<h3 className='text-sm font-medium'>Properties</h3>

						<div className='space-y-4'>
							<StatusSelect status='BACKLOG' />
							<PrioritySelect priority='LOW' />
							<AssigneeSelect />
						</div>
					</div>
				</div>
			</div>
			<NewTaskPopup
				open={subIssueDialogOpen}
				onOpenChange={setSubIssueDialogOpen}
				parentTaskId='RSTHA-4'
				parentTaskTitle='Task Title'
			/>
		</div>
	)
}
