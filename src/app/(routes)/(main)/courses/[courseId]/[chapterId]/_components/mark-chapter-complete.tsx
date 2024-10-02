"use client";

import { Button } from "@/components/ui/button";
import { handleMarkChapterComplete } from "../_action";

export const MarkChapterComplete = ({ courseId, chapterId, hasAccess }: { courseId: string; chapterId: string , hasAccess: boolean }) => {
  return (
    <Button size={"lg"} className="w-full mt-3" disabled={!hasAccess} onClick={async () => await handleMarkChapterComplete(courseId, chapterId)}>
      Mark Chapter Complete
    </Button>
  );
};
