"use client";

import { Radio, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

type Tag = string;

type LiveCardData<T extends Tag> = {
  id: string;
  img: string;
  title: string;
  watching: number;
  tags: T[];
};

type PageProps = {
  tags: Tag[];
  cardsData: LiveCardData<Tag>[];
};

export function CoursePage({ tags, cardsData }: PageProps) {
  const [selectedTag, setSelectedTag] = useState<Tag>("All");

  const filteredCards =
    selectedTag === "All"
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
              className={`cursor-pointer font-semibold ${
                selectedTag === tag
                  ? "bg-blue-700 text-white dark:bg-blue-600"
                  : ""
              }`}
            >
              {tag}
            </Button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <div className="flex min-h-screen flex-col overflow-hidden p-4">
        <main className="flex h-auto w-full flex-grow flex-col items-center justify-start gap-10 px-5">
          <section className="mx-auto my-5 grid w-full grid-cols-1 gap-x-5 gap-y-12 px-6 text-center md:grid-cols-2 md:px-8 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {filteredCards.map((card, index) => (
              <CourseCard
                key={index}
                id={card.id}
                img={card.img}
                title={card.title}
                watching={card.watching}
              />
            ))}
          </section>
        </main>
      </div>
    </div>
  );
}

// CourseCard component
type CourseCardProps = {
  id: string;
  img: string;
  title: string;
  watching: number;
};

const CourseCard = (props: CourseCardProps) => (
  <Link href={`/courses/${props.id}`}>
    <div className="group max-w-sm cursor-pointer overflow-hidden rounded-lg bg-background shadow-lg">
      <div className="relative h-auto w-full overflow-hidden rounded-lg">
        <Image
          src={props.img}
          alt={props.title}
          width={300}
          height={200}
          className="aspect-video w-full rounded-lg object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
        />
      </div>
      <div>
        <p className="mb-4 ml-4 mt-2 text-start text-sm font-semibold">
          {props.title}
        </p>
        <div className="m-4 flex items-center justify-between">
          <Button variant={"destructive"} size={"sm"}>
            <Radio className="mr-2 inline-block h-4 w-4" />
            LIVE
          </Button>
          <div className="flex items-center rounded-lg border bg-gray-200 px-2 py-1 text-xs dark:bg-zinc-900">
            <Users className="mr-2 inline-block h-4 w-4" />
            {props.watching} watching
          </div>
        </div>
      </div>
    </div>
  </Link>
);
