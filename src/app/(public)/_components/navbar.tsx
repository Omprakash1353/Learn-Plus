"use client";

import Image from "next/image";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { authClient } from "@/lib/auth-client";
import { UserDropDown } from "./user-dropdown";

const navigationItems = [
  { name: "Home", href: "/" },
  { name: "Courses", href: "/courses" },
  { name: "Dashboard", href: "/dashboard" },
];

export function Navbar() {
  const { data: session, isPending } = authClient.useSession();

  return (
    <header className="top-0 z-50 sticky bg-background/95 backdrop-blur-[backdrop-filter]:bg-background/60 w-full">
      <div className="flex items-center mx-auto px-4 min-h-16 container">
        <Link
          href="/"
          className="flex items-center space-x-2 mr-4 md:px-6 lg:px-8"
        >
          <Image
            src={"/logo.png"}
            alt="Nexus Learn logo"
            className="size-9"
            width={100}
            height={100}
          />
          <span className="font-bold">Nexus Learn</span>
        </Link>

        <nav className="hidden md:flex md:flex-1 md:justify-between md:items-center">
          <div className="flex items-center space-x-6">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="font-medium text-muted-foreground hover:text-primary text-sm transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </nav>

        <div className="flex items-center space-x-4">
          <ThemeToggle />

          {isPending ? null : session ? (
            <UserDropDown
              email={session.user.email}
              name={session.user.name}
              image={session?.user?.image ?? null}
            />
          ) : (
            <>
              <Link
                className={buttonVariants({ variant: "secondary" })}
                href="/login"
              >
                Login
              </Link>
              <Link className={buttonVariants()} href="/login">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
