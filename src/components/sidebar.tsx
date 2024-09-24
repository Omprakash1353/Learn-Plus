"use client";

import {
  LayoutDashboard,
  Compass,
  Radio,
  ChartNoAxesCombined,
  TableOfContents,
  MessagesSquare,
  User,
  Ticket,
  TagsIcon,
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
  isActive?: (pathname: string) => boolean; 
};

type NavItems = {
  ADMIN: NavItem[];
  INSTRUCTOR: NavItem[];
  STUDENT: NavItem[];
};

export function Sidebar({
  className,
  role,
}: {
  className?: string;
  role: keyof NavItems;
}) {
  const pathname = usePathname();

  const navItems: NavItems = {
    ADMIN: [
      {
        name: "Analytics",
        href: "/admin",
        icon: <ChartNoAxesCombined size={20} />,
        isActive: (pathname) => pathname === "/admin",
      },
      {
        name: "Courses",
        href: "/admin/courses",
        icon: <LayoutDashboard size={20} />,
        isActive: (pathname) =>
          pathname === "/admin/courses" ||
          pathname.startsWith("/admin/courses/"),
      },
      {
        name: "Problems",
        href: "/admin/problems",
        icon: <TableOfContents size={20} />,
        isActive: (pathname) => pathname === "/admin/FAQ",
      },
      {
        name: "Feedbacks",
        href: "/admin/feedback",
        icon: <MessagesSquare size={20} />,
        isActive: (pathname) => pathname === "/admin/feedback",
      },
      {
        name: "Users",
        href: "/admin/users",
        icon: <User size={20} />,
        isActive: (pathname) => pathname === "/admin/users",
      },
      {
        name: "More+",
        href: "/admin/more",
        icon: <TagsIcon size={20} />,
        isActive: (pathname) => pathname === "/admin/more",
      }
    ],
    INSTRUCTOR: [
      {
        name: "Dashboard",
        href: "/instructor",
        icon: <LayoutDashboard size={20} />,
        isActive: (pathname) => pathname === "/instructor",
      },
      {
        name: "Courses",
        href: "/instructor/courses",
        icon: <TableOfContents size={20} />,
        isActive: (pathname) =>
          pathname === "/instructor/courses" ||
          pathname.startsWith("/instructor/courses/"),
      },
      {
        name: "Coupons",
        href: "/instructor/coupons",
        icon: <Ticket size={20} />,
        isActive: (pathname) => pathname === "/instructor/coupons",
      },
      {
        name: "Feedbacks",
        href: "/instructor/feedback/courseId",
        icon: <MessagesSquare size={20} />,
        isActive: (pathname) => pathname === "/instructor/feedback/courseId",
      },
    ],
    STUDENT: [
      {
        name: "Dashboard",
        href: "/dashboard",
        icon: <LayoutDashboard size={20} />,
        isActive: (pathname) => pathname === "/dashboard",
      },
      {
        name: "Browse",
        href: "/courses",
        icon: <Compass size={20} />,
        isActive: (pathname) => pathname.startsWith("/courses"),
      },
      {
        name: "Live",
        href: "/live",
        icon: <Radio size={20} />,
        isActive: (pathname) => pathname === "/live",
      },
    ],
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
                  variant={item.isActive?.(pathname) ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    item.isActive?.(pathname)
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
