'use client'
import React from 'react'

import { RotateCcw } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Editor } from '@tdata/editor'

import { PropertiesPanel } from './components/properties-panel'
import { TaskActions } from './components/actions'
import { TaskActivities } from './components/activities'

export default function TaskDetails() {
	return (
		<div className='min-h-screen'>
			<div className='text-sm text-gray-500 mb-4'>RSTHA-4</div>

			<div className='grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_400px] gap-6'>
				{/* Main Content */}
				<div className='space-y-6'>
					<input
						type='text'
						defaultValue='Task Title'
						className='text-2xl font-semibold bg-transparent border-0 w-full focus:outline-none'
					/>

					<Editor className='min-h-[300px]' />

					<TaskActions />

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

						<TaskActivities />
					</div>
				</div>

				{/* Properties Sidebar */}
				<PropertiesPanel />
			</div>
		</div>
	)
}
