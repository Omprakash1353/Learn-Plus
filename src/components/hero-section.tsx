"use client";

import { ChevronRight } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Glow } from "@/components/ui/glow";
import { Mockup, MockupFrame } from "@/components/ui/mockup";
import { cn } from "@/lib/utils";
import { AnimatedGradientText } from "./magicui/animated-gradient-text";

interface HeroAction {
  text: string;
  href: string;
  icon?: React.ReactNode;
  variant?: "default" | "secondary";
}

interface HeroProps {
  badge?: {
    text: string;
    action: {
      text: string;
      href: string;
    };
  };
  title: string;
  description: string;
  actions: HeroAction[];
  image: {
    light: string;
    dark: string;
    alt: string;
  };
}

export function HeroSection({
  badge,
  title,
  description,
  actions,
  image,
}: HeroProps) {
  const { resolvedTheme } = useTheme();
  const imageSrc = resolvedTheme === "light" ? image.light : image.dark;

  return (
    <section
      className={cn(
        "bg-background text-foreground",
        "px-4",
        "fade-bottom overflow-hidden pb-0"
      )}
    >
      <div className="mx-auto flex max-w-container flex-col gap-12 pt-16 sm:gap-24">
        <div className="flex flex-col items-center gap-6 text-center sm:gap-12">
          {/* Badge */}
          {badge && (
            <>
              <div className="group relative mx-auto flex items-center justify-center rounded-full px-4 py-1.5 shadow-[inset_0_-8px_10px_#8fdfff1f] transition-shadow duration-500 ease-out hover:shadow-[inset_0_-5px_10px_#8fdfff3f] ">
                <span
                  className={cn(
                    "absolute inset-0 block h-full w-full animate-gradient rounded-[inherit] bg-gradient-to-r from-[#ffaa40]/50 via-[#9c40ff]/50 to-[#ffaa40]/50 bg-[length:300%_100%] p-[1px]"
                  )}
                  style={{
                    WebkitMask:
                      "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    WebkitMaskComposite: "destination-out",
                    mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    maskComposite: "subtract",
                    WebkitClipPath: "padding-box",
                  }}
                />
                🎉 <hr className="mx-2 h-4 w-px shrink-0 bg-neutral-500" />
                <AnimatedGradientText className="text-sm font-medium">
                  {badge.text}
                </AnimatedGradientText>
                <ChevronRight
                  className="ml-1 size-4 stroke-neutral-500 transition-transform
 duration-300 ease-in-out group-hover:translate-x-0.5"
                />
              </div>
            </>
          )}

          {/* Title */}
          <h1 className="relative z-10 inline-block animate-appear bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-4xl font-semibold leading-tight text-transparent drop-shadow-2xl sm:text-6xl sm:leading-tight md:text-8xl md:leading-tight">
            {title}
          </h1>

          {/* Description */}
          <p className="text-md relative z-10 max-w-[550px] animate-appear font-medium text-muted-foreground opacity-0 delay-100 sm:text-xl">
            {description}
          </p>

          {/* Actions */}
          <div className="relative z-10 flex animate-appear justify-center gap-4 opacity-0 delay-300">
            <div className="relative z-10 flex animate-appear justify-center gap-4 opacity-0 delay-300">
              {actions.map((action, index) => (
                <Button key={index} variant={action.variant} size="lg" asChild>
                  <a href={action.href} className="flex items-center gap-2">
                    {action.icon}
                    {action.text}
                  </a>
                </Button>
              ))}
            </div>
          </div>

          {/* Image with Glow */}
          <div className="relative pt-12">
            <MockupFrame
              className="animate-appear opacity-0 delay-700"
              size="small"
            >
              <Mockup type="responsive">
                <Image
                  src={imageSrc}
                  alt={image.alt}
                  width={1248}
                  height={765}
                  priority
                />
              </Mockup>
            </MockupFrame>
            <Glow
              variant="top"
              className="animate-appear-zoom opacity-0 delay-1000"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
