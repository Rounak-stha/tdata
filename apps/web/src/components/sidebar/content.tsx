"use client";
import {
  SidebarContent as _SidebarContent,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@components/ui/sidebar";
import { FolderDotIcon, FolderKanbanIcon, ListTodoIcon, PlusIcon, SearchIcon } from "lucide-react";
import { useOrganizations } from "@/hooks";
import { Paths } from "@/lib/constants";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";

// Menu items.
const items = [
  {
    title: "My Tasks",
    url: (orgKey: string) => Paths.myTasks(orgKey),
    icon: ListTodoIcon,
  },
  {
    title: "Search",
    url: (orgKey: string) => Paths.search(orgKey),
    icon: SearchIcon,
  },
];

export const SidebarContent = () => {
  const { organization } = useOrganizations();
  const router = useRouter();

  return (
    <>
      <_SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url(organization.key)}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <Collapsible defaultOpen asChild>
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip="Projects">
                  <FolderDotIcon />
                  <span>Projects</span>
                  <SidebarMenuAction onClick={() => router.push(Paths.newProject(organization.key))}>
                    <PlusIcon /> <span className="sr-only">Add Project</span>
                  </SidebarMenuAction>
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {organization.projects.map((project) => (
                    <SidebarMenuSubItem key={project.key}>
                      <SidebarMenuSubButton asChild>
                        <Link href={Paths.project(organization.key, project.key)}>
                          <span>{project.name}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        </SidebarGroup>
      </_SidebarContent>
    </>
  );
};
