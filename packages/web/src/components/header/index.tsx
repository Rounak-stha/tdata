'use client'

import { FC } from 'react'
import { ViewToggle } from '@components/view-toggle'
import { Filters } from '@components/filter'
import { ThemeToggle } from '@components/theme-toggle'
import type { Priority, Status, ViewType } from '@type/kanban'
import { BreadCrump } from './breadcrump'

type HeaderProps = {
	view: ViewType
	onViewChange: (view: ViewType) => void
	selectedPriorities: Priority[]
	setSelectedPriorities: (priorities: Priority[]) => void
	selectedStatuses: Status[]
	setSelectedStatuses: (statuses: Status[]) => void
}

export const Header: FC<HeaderProps> = ({
	view,
	onViewChange,
	selectedPriorities,
	selectedStatuses,
	setSelectedPriorities,
	setSelectedStatuses
}) => {
	console.log({ selectedPriorities, selectedStatuses })
	return (
		<div className='h-full flex-1 flex flex-col p-8 space-y-6'>
			<div className='flex'>
				<div className='flex-1 flex items-center'>
					<BreadCrump />
				</div>
				<div className='flex items-center justify-between gap-4'>
					<ViewToggle view={view} onViewChange={onViewChange} />
					<Filters
						selectedPriorities={selectedPriorities}
						selectedStatuses={selectedStatuses}
						onPriorityChange={setSelectedPriorities}
						onStatusChange={setSelectedStatuses}
					/>
					<ThemeToggle />
				</div>
			</div>
		</div>
	)
}
