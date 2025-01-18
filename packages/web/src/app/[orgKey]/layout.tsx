import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/sidebar'
import { Header } from '@/components/header/main'
import { UserProvider } from '@/components/context/user'
import { getOrganizationByUserAndKey, getOrganizationMembers } from '@/lib/server/organization'
import { OrganizationProvider } from '@/components/context/organization'
import { getUser } from '@/lib/actions/user'
import { getSession } from '@/lib/server'

export default async function Layout({
	children,
	params
}: {
	children: React.ReactNode
	params: Promise<{ orgKey: string }>
}) {
	const { orgKey } = await params
	const { user: sessionUser } = await getSession()
	const { organization, role } = await getOrganizationByUserAndKey(sessionUser.id, orgKey)
	const user = await getUser(sessionUser.id, organization.id)
	const members = await getOrganizationMembers(organization.id)

	return (
		<SidebarProvider className='h-full w-full flex flex-col'>
			<UserProvider initialUser={{ ...user, role }}>
				<OrganizationProvider initialOrganization={{ ...organization, members }}>
					<Header />
					<div className='flex flex-1'>
						<AppSidebar />
						{/* NOTE: the class `min-w-0` should not be removed from here as it ensures that the main content width does not exceed than it should */}
						<main className='flex-1 min-w-0 px-6 py-4'>{children}</main>
					</div>
				</OrganizationProvider>
			</UserProvider>
		</SidebarProvider>
	)
}
