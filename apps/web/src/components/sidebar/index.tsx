"use client";
import { Sidebar } from "@/components/ui/sidebar";
import { SidebarHeader } from "./header";
import { SidebarContent } from "./content";

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader />
      <SidebarContent />
    </Sidebar>
  );
}
