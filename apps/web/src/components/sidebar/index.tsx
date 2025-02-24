import { Sidebar } from "@/components/ui/sidebar";
// import { SidebarHeader } from './header'
// import { SidebarFooter } from './footer'
import { SidebarContent } from "./content";

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon" variant="sidebar">
      {/* <SidebarHeader /> */}
      <SidebarContent />
      {/* <SidebarFooter /> */}
    </Sidebar>
  );
}
