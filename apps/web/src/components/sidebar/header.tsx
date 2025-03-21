import { SidebarHeader as _SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@components/ui/sidebar";
import { useOrganizations } from "@/hooks";
import { OrganizationAvatar } from "../ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from "../ui/dropdown-menu";
import { SettingsIcon, UsersIcon } from "lucide-react";

export const SidebarHeader = () => {
  const { organization } = useOrganizations();

  return (
    <_SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground" tooltip="Menu">
                <OrganizationAvatar src={organization.imageUrl} alt="Organization avatar" fallbackText={organization.key[0]} />
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-bold">{organization.name}</span>
                  <span className="text-xs text-muted-foreground">Tdata</span>
                </div>
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem disabled>
                <SettingsIcon className="mr-2 h-4 w-4" />
                <span>Settings (Coming Soon)</span>
              </DropdownMenuItem>
              <DropdownMenuItem disabled>
                <UsersIcon className="mr-2 h-4 w-4" />
                <span>Manage Members (Coming Soon)</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </_SidebarHeader>
  );
};
