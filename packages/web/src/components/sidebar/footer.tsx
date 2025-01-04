import {
	SidebarFooter as _SidebarFooter,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem
} from '@components/ui/sidebar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@components/ui/dropdown-menu'
import { ChevronUpIcon, User2Icon } from 'lucide-react'

export const SidebarFooter = () => {
	return (
		<_SidebarFooter>
			<SidebarMenu>
				<SidebarMenuItem>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<SidebarMenuButton>
								<User2Icon /> Username
								<ChevronUpIcon className='ml-auto' />
							</SidebarMenuButton>
						</DropdownMenuTrigger>
						<DropdownMenuContent side='top' className='w-[--radix-popper-anchor-width]'>
							<DropdownMenuItem>
								<span>Account</span>
							</DropdownMenuItem>
							<DropdownMenuItem>
								<span>Billing</span>
							</DropdownMenuItem>
							<DropdownMenuItem>
								<span>Sign out</span>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</SidebarMenuItem>
			</SidebarMenu>
		</_SidebarFooter>
	)
}
