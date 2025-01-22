'use client'
import {
	SidebarContent as _SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarMenu,
	SidebarMenuAction,
	SidebarMenuButton,
	SidebarMenuItem
} from '@components/ui/sidebar'
import { BoxesIcon, CalendarIcon, HomeIcon, InboxIcon, PlusIcon, SearchIcon, SettingsIcon } from 'lucide-react'
import { useState } from 'react'
import { NewProjectPopup } from '../new-project-popup'

// Menu items.
const items = [
	{
		title: 'Home',
		url: '#',
		icon: HomeIcon
	},
	{
		title: 'Inbox',
		url: '#',
		icon: InboxIcon
	},
	{
		title: 'Projects',
		url: '/projects',
		icon: BoxesIcon
	},
	{
		title: 'Calendar',
		url: '#',
		icon: CalendarIcon
	},
	{
		title: 'Search',
		url: '#',
		icon: SearchIcon
	},
	{
		title: 'Settings',
		url: '#',
		icon: SettingsIcon
	}
]

export const SidebarContent = () => {
	const [newProjectPopupOpen, setNewProjectPopupOpen] = useState(false)
	return (
		<>
			<_SidebarContent>
				<SidebarGroup>
					{/* <SidebarGroupLabel>Application</SidebarGroupLabel> */}
					<SidebarGroupContent>
						<SidebarMenu>
							{items.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton asChild>
										<a href={item.url}>
											<item.icon />
											<span>{item.title}</span>
										</a>
									</SidebarMenuButton>
									{item.title === 'Projects' && (
										<SidebarMenuAction onClick={() => setNewProjectPopupOpen(true)}>
											<PlusIcon /> <span className='sr-only'>Add Project</span>
										</SidebarMenuAction>
									)}
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</_SidebarContent>
			<NewProjectPopup open={newProjectPopupOpen} onOpenChange={setNewProjectPopupOpen} />
		</>
	)
}
