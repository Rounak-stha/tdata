import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar";
import { Header } from "@/components/header/main";
import { UserProvider } from "@/components/context/user";
import { getOrganizationByUserAndKey, getOrganizationMembers } from "@/lib/server/organization";
import { OrganizationProvider } from "@/components/context/organization";
import { getUser } from "@/lib/actions/user";
import { getSession } from "@/lib/server";
import { SWRProvider } from "@/components/providers";

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ orgKey: string }> }) {
  const { orgKey } = await params;
  const { user: sessionUser } = await getSession();
  const { organization, role } = await getOrganizationByUserAndKey(sessionUser.id, orgKey);
  const user = await getUser(sessionUser.id, organization.id);
  const members = await getOrganizationMembers(organization.id);

  return (
    <SWRProvider>
      <SidebarProvider className="h-full w-full flex">
        <UserProvider initialUser={{ ...user, role }}>
          <OrganizationProvider initialOrganization={{ ...organization, members }}>
            <AppSidebar />
            <div className="flex-1">
              <Header organization={organization} />
              <div className="flex flex-1">
                {/* NOTE: the class `min-w-0` should not be removed from here as it ensures that the main content width does not exceed than it should */}
                <main className="flex-1 min-w-0">{children}</main>
              </div>
            </div>
          </OrganizationProvider>
        </UserProvider>
      </SidebarProvider>
    </SWRProvider>
  );
}
