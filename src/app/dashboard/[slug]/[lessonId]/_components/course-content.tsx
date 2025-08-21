"use client";

import { BookIcon, CheckCircle } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";

import { LessonContentType } from "@/app/data/course/get-lesson-content";
import { RenderDescription } from "@/components/rich-text-editor/render-description";
import { Button } from "@/components/ui/button";
import { tryCatch } from "@/hooks/try-catch";
import { useConstructUrl } from "@/hooks/use-construct-url";
import { markLessonComplete } from "../actions";

export function CourseContent({ data }: { data: LessonContentType }) {
  const [pending, startTransition] = useTransition();

  function VideoPlayer({
    thumbnailKey,
    videoKey,
  }: {
    thumbnailKey: string;
    videoKey: string;
  }) {
    const videoUrl = useConstructUrl(videoKey);
    const thumbnailUrl = useConstructUrl(thumbnailKey);

    if (!videoKey) {
      return (
        <div className="flex justify-center items-center bg-muted rounded-lg aspect-video">
          <BookIcon className="mx-auto mb-4 size-16 text-primary" />
          <p className="text-muted-foreground">
            This lesson does not have a video yet
          </p>
        </div>
      );
    }

    return (
      <div className="relative bg-black rounded-lg aspect-video overflow-hidden">
        <video
          className="w-full h-full object-cover"
          controls
          poster={thumbnailUrl}
        >
          <source src={videoUrl} type="video/mp4" />
          <source src={videoUrl} type="video/webm" />
          <source src={videoUrl} type="video/ogg" />
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }

  function handleMarkAsComplete() {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(
        markLessonComplete(data.id, data.chapter.course.slug)
      );

      if (error) {
        toast.error("An unexpected error occurred. Please try again");
        return;
      }

      if (result.status === "success") {
        toast.success(result.message);
      } else if (result.status === "error") {
        toast.error(result.message);
      }
    });
  }

  return (
    <div className="flex flex-col bg-background p-6 h-full">
      <VideoPlayer
        thumbnailKey={data.thumbnailKey ?? ""}
        videoKey={data.thumbnailKey ?? ""}
      />

      <div className="py-4 border-b">
        {data.lessonProgresses.length > 0 ? (
          <Button
            variant="outline"
            className="bg-green-500/10 text-green-500 hover:text-green-600"
          >
            <CheckCircle className="mr-2 size-4 text-green-500" />
            Completed
          </Button>
        ) : (
          <Button
            variant="outline"
            disabled={pending}
            onClick={handleMarkAsComplete}
          >
            <CheckCircle className="mr-2 size-4 text-green-500" /> Mark as
            Complete
          </Button>
        )}
      </div>

      <div className="space-y-3 pt-3">
        <h1 className="font-bold text-foreground text-3xl tracking-tight">
          {data.title}
        </h1>

        {data.description && (
          <RenderDescription json={JSON.parse(data.description)} />
        )}
      </div>
    </div>
  );
}
