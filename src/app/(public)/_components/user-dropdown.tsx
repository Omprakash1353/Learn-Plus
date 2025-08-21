import {
  BookOpen,
  ChevronDownIcon,
  Home,
  LayoutDashboard,
  LogOutIcon,
} from "lucide-react";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSignOut } from "@/hooks/use-signout";
import { avatarFallbackNameImage } from "@/lib/utils";

interface UserDropDownProps {
  name: string;
  email: string;
  image: string | null;
}

export function UserDropDown({ email, name, image }: UserDropDownProps) {
  const handleSignOut = useSignOut();

  const { fallbackCharacter, fallbackImage } = avatarFallbackNameImage({
    email: email,
    name: name,
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="hover:bg-transparent p-0 h-auto">
          <Avatar>
            <AvatarImage src={image ?? fallbackImage} alt="Profile image" />
            <AvatarFallback>{fallbackCharacter}</AvatarFallback>
          </Avatar>
          <ChevronDownIcon
            size={16}
            className="opacity-60"
            aria-hidden="true"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="max-w-64">
        <DropdownMenuLabel className="flex flex-col min-w-0">
          <span className="font-medium text-foreground text-sm truncate">
            {name}
          </span>
          <span className="font-normal text-muted-foreground text-xs truncate">
            {email}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/">
              <Home size={16} className="opacity-60" aria-hidden="true" />
              <span>Home</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/courses">
              <BookOpen size={16} className="opacity-60" aria-hidden="true" />
              <span>Courses</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/dashboard">
              <LayoutDashboard
                size={16}
                className="opacity-60"
                aria-hidden="true"
              />
              <span>Dashboard</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOutIcon size={16} className="opacity-60" aria-hidden="true" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
