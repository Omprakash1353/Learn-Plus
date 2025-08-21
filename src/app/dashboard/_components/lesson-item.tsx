"use client";

import { Check, Play } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Props {
  lesson: {
    id: string;
    title: string;
    position: number;
    description: string | null;
  };
  slug: string;
  isActive?: boolean;
  completed: boolean;
}

export function LessonItem({ lesson, slug, isActive, completed }: Props) {
  return (
    <Link
      href={`/dashboard/${slug}/${lesson.id}`}
      className={buttonVariants({
        variant: completed ? "secondary" : "outline",
        className: cn(
          "justify-start p-2.5 w-full h-auto transition-all",
          completed &&
            "bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700 hover:bg-green-200 dark:hover:bg-green-900/50 text-green-800 dark:text-green-200",
          isActive &&
            !completed &&
            "bg-primary/10 dark:bg-primary/20 border-primary/50 hover:bg-primary/20 dark:hover:bg-primary/30 text-primary-foreground"
        ),
      })}
    >
      <div className="flex items-center gap-2.5 w-full min-w-0">
        <div className="shrink-0">
          {completed ? (
            <div className="flex justify-center items-center bg-green-600 dark:bg-green-500 rounded-full size-5">
              <Check className="size-3 text-white" />
            </div>
          ) : (
            <div
              className={cn(
                "flex justify-center items-center bg-background border-2 rounded-full size-5",
                isActive
                  ? "border-primary bg-primary/10 dark:bg-primary/20"
                  : "border-muted-foreground/60"
              )}
            >
              <Play
                className={cn(
                  "fill-current size-2.5",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0 text-left">
          <p
            className={cn(
              "font-medium text-xs truncate",
              completed
                ? "text-green-800 dark:text-green-200"
                : isActive
                  ? "text-primary font-semibold"
                  : "text-foreground"
            )}
          >
            {lesson.position}. {lesson.title}
          </p>
          {completed && (
            <p className="font-medium text-[10px] text-green-700 dark:text-green-300">
              Completed
            </p>
          )}

          {isActive && !completed && (
            <p className="font-medium text-[10px] text-primary">
              Currently Watching
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
