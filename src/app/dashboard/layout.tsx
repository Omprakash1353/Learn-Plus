import { ReactNode } from "react";

import { SiteHeader } from "@/components/sidebar/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./_components/dashboard-app-sidebar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-col flex-1">
          <div className="@container/main flex flex-col flex-1 gap-2">
            <div className="flex flex-col gap-4 md:gap-6 px-4 lg:px-6 py-4 md:py-6">
              {children}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
