import {
	SidebarContent as _SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem
} from '@components/ui/sidebar'
import { CalendarIcon, HomeIcon, InboxIcon, SearchIcon, SettingsIcon } from 'lucide-react'

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
	return (
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
							</SidebarMenuItem>
						))}
					</SidebarMenu>
				</SidebarGroupContent>
			</SidebarGroup>
		</_SidebarContent>
	)
}
