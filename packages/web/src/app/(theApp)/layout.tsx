import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/sidebar'
import { Header } from '@/components/header/main'
import { UserProvider } from '@/components/context/user'
import { getUser } from '@/lib/supabase/server/client'

export default async function Layout({ children }: { children: React.ReactNode }) {
	const user = await getUser()
	return (
		<SidebarProvider className='h-full w-full flex flex-col'>
			<UserProvider initialUser={user}>
				<Header />
				<div className='flex flex-1'>
					<AppSidebar />
					{/* NOTE: the class `min-w-0` should not be removed from here as it ensures that the main content width does not exceed than it should */}
					<main className='flex-1 min-w-0 px-6 py-4'>{children}</main>
				</div>
			</UserProvider>
		</SidebarProvider>
	)
}
