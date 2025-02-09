"use client";
import { SidebarContent as _SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuAction, SidebarMenuButton, SidebarMenuItem } from "@components/ui/sidebar";
import { BoxesIcon, HomeIcon, PlusIcon } from "lucide-react";
import { useOrganizations } from "@/hooks";
import { Paths } from "@/lib/constants";
import { useRouter } from "next/navigation";

// Menu items.
const items = [
  {
    title: "My Tasks",
    url: (orgKey: string) => Paths.myTasks(orgKey),
    icon: HomeIcon,
  },
  {
    title: "Projects",
    url: (orgKey: string) => Paths.projects(orgKey),
    icon: BoxesIcon,
  },
];

export const SidebarContent = () => {
  const { organization } = useOrganizations();
  const router = useRouter();

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
                    <a href={item.url(organization.key)}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                  {item.title === "Projects" && (
                    <SidebarMenuAction onClick={() => router.push(Paths.newProject(organization.key))}>
                      <PlusIcon /> <span className="sr-only">Add Project</span>
                    </SidebarMenuAction>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </_SidebarContent>
    </>
  );
};
