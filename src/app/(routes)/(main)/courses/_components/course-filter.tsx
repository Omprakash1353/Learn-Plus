"use client";

import { useState } from "react";

import { CourseEnrollmentCard } from "@/components/course-progress-card";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Tag } from "@/types/type";

export type courseCardProps = {
  chapters: number;
  tags: string[];
  duration: number;
  id: string;
  title: string;
  price: number | null;
  thumbnailUrl: string | null;
}[];

type PageProps = {
  tags: string[];
  cardsData: courseCardProps;
};

export function CoursePage({ tags, cardsData }: PageProps) {
  const [selectedTag, setSelectedTag] = useState<string>("all");

  const filteredCards =
    selectedTag === "all"
      ? cardsData
      : cardsData.filter((card) => card.tags.includes(selectedTag));

  return (
    <div className="w-full">
      <ScrollArea className="relative mx-auto w-full whitespace-nowrap p-4">
        <div className="flex max-w-7xl space-x-2">
          {tags.map((tag) => (
            <Button
              key={tag}
              size={"sm"}
              variant={"secondary"}
              onClick={() => setSelectedTag(tag)}
              className={cn(
                "cursor-pointer font-semibold",
                `${
                  selectedTag === tag
                    ? "bg-blue-700 text-white dark:bg-blue-600"
                    : ""
                }`,
              )}
            >
              {tag.toUpperCase()}
            </Button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <div className="flex min-h-screen flex-col overflow-hidden">
        <main className="flex h-auto w-full flex-grow flex-col items-center justify-start gap-10">
          <div className="mx-auto my-5 grid w-full grid-cols-1 gap-x-5 gap-y-12 px-6 md:grid-cols-2 md:px-8 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {filteredCards.map((card, index) => (
              <CourseEnrollmentCard key={index} courseDetails={card} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
