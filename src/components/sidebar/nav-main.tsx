"use client";

import { IconCirclePlusFilled, type Icon } from "@tabler/icons-react";
import Link from "next/link";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: Icon;
  }[];
}) {
  const pathname = usePathname();
  const { data } = authClient.useSession();

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          
            <SidebarMenuItem className="flex items-center gap-2">
              <SidebarMenuButton
                asChild
                tooltip="Quick Create"
                className="bg-primary hover:bg-primary/90 active:bg-primary/90 min-w-8 text-primary-foreground hover:text-primary-foreground active:text-primary-foreground duration-200 ease-linear"
              >
                <Link href={data?.user.role === "admin" ? "/admin/courses/create" : "/instructor/courses/create"}>
                  <IconCirclePlusFilled />
                  <span>Quick Create</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton tooltip={item.title} asChild>
                <Link
                  href={item.url}
                  className={cn(
                    pathname === item.url && "bg-accent text-accent-foreground"
                  )}
                >
                  {item.icon && (
                    <item.icon
                      className={cn(pathname === item.url && "text-primary")}
                    />
                  )}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
