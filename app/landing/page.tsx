import { SidebarProvider } from "@/components/ui/sidebar";
import Llm from "../llm/page";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset } from "@/components/ui/sidebar";


export default function Landing() {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <Llm />
      </SidebarInset>
    </SidebarProvider>
  );
}
    
  