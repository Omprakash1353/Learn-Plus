import { ReactNode } from "react";

import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SiteHeader } from "@/components/sidebar/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" role="admin" />
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
