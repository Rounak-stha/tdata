'use client'

import { Bell, Moon, Sun } from 'lucide-react'

import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { useTheme } from 'next-themes'
import { SidebarTrigger } from '@/components/ui/sidebar'

export function Header() {
	const { setTheme, theme } = useTheme()

	return (
		<header className='sticky top-0 z-50 flex h-16 border-b items-center gap-4 bg-background px-4'>
			<div className='flex-1 flex items-center'>
				<SidebarTrigger />
				<p className='font-bold ml-2'>TData</p>
				<p className='font-bold ml-2'>|</p>
				<p className='font-bold ml-2'>Company Name</p>
			</div>
			<div className='flex items-center gap-4'>
				<Input type='search' placeholder='Search...' className='md:w-[200px] lg:w-[300px]' />
				<Popover>
					<PopoverTrigger asChild>
						<Button variant='ghost' size='icon' className='relative' aria-label='Notifications'>
							<Bell className='h-4 w-4' />
							<span className='absolute right-1 top-1 h-2 w-2 rounded-full bg-primary' />
						</Button>
					</PopoverTrigger>
					<PopoverContent className='w-80' align='end'>
						<div className='space-y-4'>
							<div className='flex items-center gap-2'>
								<h4 className='font-medium leading-none'>Notifications</h4>
								<Separator orientation='vertical' className='h-4' />
								<Button variant='ghost' size='sm' className='ml-auto h-auto px-2 text-xs'>
									Mark all as read
								</Button>
							</div>
							<div className='space-y-2'>
								{/* Sample notifications */}
								<div className='flex items-start gap-4 rounded-lg p-2 hover:bg-muted'>
									<Avatar src='' alt='' />
									<div className='space-y-1'>
										<p className='text-sm'>New task assigned to you</p>
										<p className='text-xs text-muted-foreground'>2 minutes ago</p>
									</div>
								</div>
								<div className='flex items-start gap-4 rounded-lg p-2 hover:bg-muted'>
									<Avatar />
									<div className='space-y-1'>
										<p className='text-sm'>Your task was completed</p>
										<p className='text-xs text-muted-foreground'>1 hour ago</p>
									</div>
								</div>
							</div>
						</div>
					</PopoverContent>
				</Popover>
				<Button
					variant='ghost'
					size='icon'
					aria-label='Toggle theme'
					onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
				>
					<Sun className='h-4 w-4 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0' />
					<Moon className='absolute h-4 w-4 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100' />
				</Button>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant='ghost' className='relative h-8 w-8 rounded-full' aria-label='User menu'>
							<Avatar />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align='end'>
						<DropdownMenuLabel>My Account</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem>Profile</DropdownMenuItem>
						<DropdownMenuItem>Settings</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem>Log out</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</header>
	)
}
