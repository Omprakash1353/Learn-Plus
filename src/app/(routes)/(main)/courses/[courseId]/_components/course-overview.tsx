"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Lock, TvMinimalPlay, Youtube } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

export default function CourseOverview({
  header,
  accessible = false,
  data,
  mode = "description",
}: {
  header: string;
  accessible?: boolean;
  mode?: "description" | "video";
  data: {
    title: string;
    duration: string;
    chapters: {
      id: string;
      name: string;
    }[];
  }[];
}) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const pathname = usePathname();

  const DynamicLink = ({
    children,
    href,
    chapterId,
  }: {
    children: React.ReactNode;
    href?: string;
    chapterId: string;
  }) => {
    const isCurrent = pathname?.includes(chapterId);

    return accessible && href ? (
      <Link href={href} className="w-full">
        <li
          className={cn(
            "flex items-start justify-between gap-2 p-2 transition-colors",
            isCurrent ? "font-semibold" : "",
          )}
          aria-current={isCurrent ? "page" : undefined}
        >
          {children}
        </li>
      </Link>
    ) : (
      <li
        className={cn(
          "flex items-start justify-between gap-2 transition-colors",
          isCurrent ? "font-semibold" : "",
        )}
        aria-current={isCurrent ? "page" : undefined}
      >
        {children}
      </li>
    );
  };

  return (
    <Card className="border-none shadow-none outline-none">
      <CardHeader>
        <CardTitle className="text-lg">{header}</CardTitle>
      </CardHeader>
      <Accordion type="single" collapsible className="px-5">
        {data.map((content, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="flex items-center justify-between rounded-md">
              <div className="flex items-center gap-4">
                {mode === "description" ? (
                  <TvMinimalPlay className="text-blue-500" />
                ) : (
                  <Youtube className="text-blue-500" />
                )}
                <div>
                  <h3 className="text-sm font-semibold">{content.title}</h3>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="ml-4 mt-2 space-y-2">
                {content.chapters.map((chapter, i) => (
                  <DynamicLink
                    key={chapter.id}
                    href={accessible ? `#lesson-${chapter.id}` : undefined}
                    chapterId={chapter.id}
                  >
                    <div className="flex gap-2">
                      <span>
                        {mode === "description" ? (
                          <TvMinimalPlay className="text-blue-500" />
                        ) : (
                          <Youtube className="text-blue-500" />
                        )}
                      </span>
                      <span>{i + 1}.</span>
                      <span>{chapter.name}</span>
                    </div>
                    <span>
                      <Lock className="h-4 w-4" />
                    </span>
                  </DynamicLink>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Card>
  );
}
