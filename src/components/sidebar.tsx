"use client";

import {
  Home,
  LayoutDashboard,
  Compass,
  Radio,
  ChartNoAxesCombined,
  TableOfContents,
  MessagesSquare,
  User,
  Ticket,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

type NavItem = {
  name: string;
  href: string;
  icon: React.ReactNode;
};

type NavItems = {
  admin: NavItem[];
  instructor: NavItem[];
  user: NavItem[];
};

const navItems: NavItems = {
  admin: [
    { name: "Home", href: "/", icon: <Home size={20} /> },
    {
      name: "Analytics",
      href: "/admin",
      icon: <ChartNoAxesCombined size={20} />,
    },
    {
      name: "Courses",
      href: "/admin/courses",
      icon: <LayoutDashboard size={20} />,
    },
    { name: "FAQs", href: "/admin/FAQ", icon: <TableOfContents size={20} /> },
    {
      name: "Feedbacks",
      href: "/admin/feedback",
      icon: <MessagesSquare size={20} />,
    },
    { name: "Users", href: "/admin/users", icon: <User size={20} /> },
  ],
  instructor: [
    { name: "Home", href: "/", icon: <Home size={20} /> },
    {
      name: "Dashboard",
      href: "/instructor",
      icon: <LayoutDashboard size={20} />,
    },
    {
      name: "Courses",
      href: "/instructor/courses",
      icon: <TableOfContents size={20} />,
    },
    { name: "Coupons", href: "/coupons", icon: <Ticket size={20} /> },
    {
      name: "Feedbacks",
      href: "/feedback/courseId",
      icon: <MessagesSquare size={20} />,
    },
  ],
  user: [
    { name: "Home", href: "/", icon: <Home size={20} /> },
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    { name: "Browse", href: "/courses", icon: <Compass size={20} /> },
    { name: "Live", href: "/live", icon: <Radio size={20} /> },
  ],
};

type SidebarProps = {
  className?: string;
  role: keyof NavItems;
};

export function Sidebar({ className, role }: SidebarProps) {
  const pathname = usePathname();

  const isNavItemActive = (href: string) => {
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <div
      className={cn(
        "left-0 top-0 flex h-screen flex-col justify-start gap-2 border-r-[1px] lg:fixed lg:w-[256px]",
        className,
      )}
    >
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <ScrollArea className="h-[calc(100vh-8rem)] px-2">
            <div className="space-y-1">
              {navItems[role].map((item) => (
                <Button
                  key={item.name}
                  variant={isNavItemActive(item.href) ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    isNavItemActive(item.href)
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground",
                  )}
                  asChild
                >
                  <Link href={item.href}>
                    {item.icon}
                    <span className="ml-2">{item.name}</span>
                  </Link>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
