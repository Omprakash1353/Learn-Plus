"use client";

import {
  IconDashboard,
  IconDotsVertical,
  IconLogout,
} from "@tabler/icons-react";
import { HomeIcon, Tv2 } from "lucide-react";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useSignOut } from "@/hooks/use-signout";
import { authClient } from "@/lib/auth-client";
import { avatarFallbackNameImage } from "@/lib/utils";

export function NavUser() {
  const { isMobile } = useSidebar();
  const { data: session, isPending } = authClient.useSession();
  const handleSignOut = useSignOut();

  const { fallbackCharacter, fallbackImage } = avatarFallbackNameImage({
    email: session?.user.email,
    name: session?.user.name,
  });

  if (isPending) {
    return null;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="rounded-lg w-8 h-8">
                <AvatarImage
                  src={session?.user.image ?? fallbackImage}
                  alt={session?.user.name}
                />
                <AvatarFallback className="rounded-lg">
                  {fallbackCharacter}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 grid text-sm text-left leading-tight">
                <span className="font-medium truncate">
                  {session?.user.name}
                </span>
                <span className="text-muted-foreground text-xs truncate">
                  {session?.user.email}
                </span>
              </div>
              <IconDotsVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="rounded-lg w-(--radix-dropdown-menu-trigger-width) min-w-56"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-sm text-left">
                <Avatar className="rounded-lg w-8 h-8">
                  <AvatarImage
                    src={session?.user.image ?? fallbackImage}
                    alt={session?.user.name}
                  />
                  <AvatarFallback className="rounded-lg">
                    {fallbackCharacter}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 grid text-sm text-left leading-tight">
                  <span className="font-medium truncate">
                    {session?.user.name}
                  </span>
                  <span className="text-muted-foreground text-xs truncate">
                    {session?.user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href="/">
                  <HomeIcon />
                  HomePage
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/admin">
                  <IconDashboard />
                  Dashboard
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/admin/courses">
                  <Tv2 />
                  Courses
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <IconLogout />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
