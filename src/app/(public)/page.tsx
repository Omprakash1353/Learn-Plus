"use client";

import { Icons } from "@/components/ui/icons";
import { HeroSection } from "@/components/hero-section";

export default function Home() {
  return (
    <HeroSection
      badge={{
        text: "New courses added weekly",
        action: {
          text: "Browse Courses",
          href: "/courses",
        },
      }}
      title="Unlock Your Potential with Our Learning Platform"
      description="Master new skills, track your progress, and achieve your goals with our curated learning paths and interactive lessons — all in one place."
      actions={[
        {
          text: "Get Started",
          href: "/dashboard",
          variant: "default",
        },
        {
          text: "GitHub",
          href: "https://github.com/omprakash1353/Learn-Plus",
          variant: "secondary",
          icon: <Icons.gitHub className="h-5 w-5" />,
        },
      ]}
      image={{
        light: "/light.png",
        dark: "/dark.png",
        alt: "UI Components Preview",
      }}
    />
  );
}
