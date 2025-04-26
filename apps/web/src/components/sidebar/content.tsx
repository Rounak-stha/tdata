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
} from "@components/ui/sidebar";
import { ArrowRightIcon, AudioWaveformIcon, CheckSquareIcon, FileTextIcon, FolderIcon, HomeIcon, ListTodoIcon, PlusIcon, SearchIcon } from "lucide-react";
import { useOrganizations } from "@/hooks";
import { Paths } from "@/lib/constants";
import Link from "next/link";

export const SidebarContent = () => {
  const { organization } = useOrganizations();

  return (
    <_SidebarContent>
      {/* Main Navigation */}
      <SidebarGroup>
        <SidebarGroupLabel>Navigation</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Dashboard">
                <Link aria-disabled href="/dashboard">
                  <HomeIcon />
                  <span>Dashboard (Coming Soon)</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="My Tasks">
                <Link href={Paths.myTasks(organization.key)}>
                  <CheckSquareIcon />
                  <span>My Tasks</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Search">
                <Link href={Paths.search(organization.key)}>
                  <SearchIcon />
                  <span>Search (WIP)</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Chat with Mira">
                <Link href={Paths.chat(organization.key)}>
                  <AudioWaveformIcon />
                  <span>Chat with Mira</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Documents">
                <Link href={Paths.docs(organization.key)}>
                  <FileTextIcon />
                  <span>Search (WIP)</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      {/* Projects */}
      <SidebarGroup>
        <SidebarGroupLabel>Projects</SidebarGroupLabel>
        <SidebarGroupAction>
          <Link href={Paths.newProject(organization.key)} className="block">
            <span className="sr-only">Add Project</span>
            <PlusIcon size={16} />
          </Link>
        </SidebarGroupAction>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem key="sidebarMenuNewProject">
              <SidebarMenuButton asChild tooltip="All Projects">
                <Link className="flex items-center" href={Paths.projects(organization.key)}>
                  <FolderIcon size={16} />
                  <span>All Projects</span>
                  <SidebarMenuAction>
                    <ArrowRightIcon size={16} />
                  </SidebarMenuAction>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            {organization.projects.map((project) => (
              <SidebarMenuItem key={project.id}>
                <SidebarMenuButton asChild tooltip={project.name}>
                  <Link href={Paths.project(organization.key, project.key)}>
                    <FolderIcon />
                    <span>{project.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </_SidebarContent>
  );
};
