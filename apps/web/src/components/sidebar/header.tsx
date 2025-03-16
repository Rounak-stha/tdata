import { SidebarHeader as _SidebarHeader, SidebarMenuButton, SidebarMenuItem } from "@components/ui/sidebar";
import { useOrganizations } from "@/hooks";
import { OrganizationAvatar } from "../ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from "../ui/dropdown-menu";
import { Button } from "../ui/button";

export const SidebarHeader = () => {
  const { organization } = useOrganizations();
  return (
    <_SidebarHeader>
      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton asChild>
                <Button variant="outline" className="w-full border-none px-1 flex items-center justify-start">
                  <OrganizationAvatar src={organization.imageUrl} alt="Organization avatar" fallbackText={organization.key[0]} />
                  <span className="font-bold">{organization.name}</span>
                </Button>
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem disabled>Settings (Coming Soon)</DropdownMenuItem>
              <DropdownMenuItem disabled>Manage Members (Coming Soon)</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </_SidebarHeader>
  );
};
