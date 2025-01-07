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
import { useUser } from '@/hooks/auth'
// import { logOut } from '@/lib/actions/auth'
import { createSupabaseBrowserClient } from '@lib/supabase/browser/client'
import { useState } from 'react'
import { toast } from 'sonner'

export const UserDropDown = () => {
	const { user } = useUser()
	console.log('In UserDropdown:', user)
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant='ghost' className='relative h-8 w-8 rounded-full' aria-label='User menu'>
					<Avatar src={user.avatar} />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align='end'>
				<DropdownMenuLabel>My Account</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem>Profile</DropdownMenuItem>
				<DropdownMenuItem>Settings</DropdownMenuItem>
				<DropdownMenuSeparator />
				<Signout />
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

const Signout = () => {
	const [loading, setLoading] = useState(false)

	const handleClick = async () => {
		try {
			console.log('logging out')
			setLoading(true)
			const client = await createSupabaseBrowserClient()
			const { error } = await client.auth.signOut({ scope: 'local' })
			if (error) toast.error('Failed to log out')
		} catch {
			toast.error('Failed to log out')
		} finally {
			setLoading(false)
		}
	}

	return (
		<DropdownMenuItem onClick={handleClick} disabled={loading}>
			Log outhaha
		</DropdownMenuItem>
	)
}
