"use client";

import { LaptopIcon, MoonIcon, SunIcon } from "@radix-ui/react-icons";
import {
  Bell,
  BookOpen,
  Laptop,
  LayoutDashboard,
  LogOut,
  User,
  User2,
} from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { signOut } from "@/actions/auth.action";
import { useSession } from "@/contexts/session-provider";
import { cn } from "@/lib/utils";
import { Icons } from "./icons";
import { ToastMessage } from "./toast";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "./ui/command";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function Header() {
  const { user } = useSession();
  const { setTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignOut = async () => {
    const res = await signOut();
    if (!res.success || res.error) {
      ToastMessage({ message: res?.error || res.message, type: "error" });
    } else if (res.success) {
      ToastMessage({ message: res.message, type: "success" });
    }
  };

  return (
    <header
      className={cn(
        `fixed left-0 right-0 top-0 z-20 w-full border-b bg-transparent px-2 transition-all duration-200 ${
          hasScrolled || isMenuOpen ? "shadow-lg backdrop-blur-lg" : ""
        }`,
      )}
    >
      <nav className="flex h-16 w-full items-center justify-between gap-44 px-5">
        <div className="flex h-full items-center gap-4">
          <Link href={"/"}>
            <div className="flex aspect-[5/1] h-full items-center justify-center">
              <span className="satisfy-regular flex items-center gap-2 text-3xl font-extrabold">
                <Image
                  src="/logo.png"
                  alt=""
                  width={50}
                  height={50}
                  className="rounded-full"
                />
                LearnPlus+
              </span>
            </div>
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <CommandMenu />
          {user?.email || user?.name ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="cursor-pointer">
                <Avatar className="cursor-pointer">
                  <AvatarImage src={user?.profilePictureUrl} />
                  <AvatarFallback>
                    {user.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48">
                <DropdownMenuLabel>
                  Hello {user.name.toString()} 🖐️
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href={`/u`}>
                    <User className="mr-2 inline-block h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                {user.role === "INSTRUCTOR" && (
                  <DropdownMenuItem>
                    <Link href={"/instructor"} className="w-full">
                      <LayoutDashboard className="mr-2 inline-block h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                {user.role === "ADMIN" && (
                  <DropdownMenuItem>
                    <Link href={"/admin"} className="w-full">
                      <LayoutDashboard className="mr-2 inline-block h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span onClick={handleSignOut}>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button asChild size={"sm"} className="group">
                <Link href={"/auth"}>
                  <User2 className="mr-2 h-4 w-4" />
                  Sign Up
                </Link>
              </Button>

              <Button asChild size={"sm"}>
                <Link href={"/auth"}>
                  <Laptop className="mr-2 h-4 w-4" />
                  Login
                </Link>
              </Button>
              <Button asChild size={"sm"} variant="outline">
                <Link href={"/auth/instructor"}>
                  <BookOpen className="mr-2 h-4 w-4" />
                  Teach
                </Link>
              </Button>
            </>
          )}

          {(user?.email || user?.name) && (
            <div className="relative cursor-pointer">
              <Bell className="h-5 w-5" />
              <span className="absolute right-0 top-0 flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500"></span>
              </span>
            </div>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
    </header>
  );
}

export function CommandMenu() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { setTheme } = useTheme();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
        if (
          (e.target instanceof HTMLElement && e.target.isContentEditable) ||
          e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLTextAreaElement ||
          e.target instanceof HTMLSelectElement
        ) {
          return;
        }

        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = useCallback((command: () => unknown) => {
    setOpen(false);
    command();
  }, []);

  return (
    <>
      <Button
        variant="outline"
        size={"sm"}
        className={cn(
          "relative h-9 w-full justify-start rounded-[0.5rem] bg-background text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-40 lg:w-64",
        )}
        onClick={() => setOpen(true)}
      >
        <span className="hidden items-center justify-center gap-3 lg:inline-flex">
          <Icons.search className="w-5" />
          <span>Search courses...</span>
        </span>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type course name..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Links"></CommandGroup>

          <CommandSeparator />
          <CommandGroup heading="Theme">
            <CommandItem onSelect={() => runCommand(() => setTheme("light"))}>
              <SunIcon className="mr-2 h-4 w-4" />
              Light
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme("dark"))}>
              <MoonIcon className="mr-2 h-4 w-4" />
              Dark
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme("system"))}>
              <LaptopIcon className="mr-2 h-4 w-4" />
              System
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
