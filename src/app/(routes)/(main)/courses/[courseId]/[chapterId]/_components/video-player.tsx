"use client";

import MuxPlayer from "@mux/mux-player-react";
import { Loader2, Lock } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { handleMarkChapterComplete } from "../_action";

export const VideoPlayer = ({
  courseId,
  chapter,
  hasAccess,
  nextChapter,
}: {
  courseId: string;
  chapter: {
    id: string;
    title: string;
    video: { playbackId: string | null } | null;
  };
  hasAccess: boolean;
  nextChapter?: { id: string };
}) => {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  const handleOnComplete = async () => {
    await handleMarkChapterComplete(courseId, chapter.id);
    if (nextChapter) router.push(`/courses/${courseId}/${nextChapter.id}`);
  };
  return (
    <div className="relative aspect-video">
      {!isReady && hasAccess && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin" />
        </div>
      )}
      {!hasAccess && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-y-2">
          <Lock className="h-10 w-10" />
          <p className="text-sm">This chapter is locked</p>
        </div>
      )}
      {hasAccess && (
        <MuxPlayer
          playbackId={chapter?.video?.playbackId || ""}
          className={cn("hidden aspect-video", isReady && "block")}
          title={chapter.title}
          autoPlay
          onEnded={handleOnComplete}
          onCanPlay={() => setIsReady(true)}
        />
      )}
    </div>
  );
};
