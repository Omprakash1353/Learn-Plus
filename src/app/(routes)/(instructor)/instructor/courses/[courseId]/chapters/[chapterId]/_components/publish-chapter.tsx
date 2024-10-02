"use client";

import { useMutation } from "@tanstack/react-query";

import { chapterPublishById, chapterUnpublishById } from "../_action";
import { queryClient } from "@/contexts/query-provider";
import { ToastMessage } from "@/components/toast";
import { Button } from "@/components/ui/button";

export const PublishChapter = ({
  chapterId,
  status,
}: {
  chapterId: string;
  status: "PUBLISHED" | "DRAFT";
}) => {
  const { mutateAsync: publishChapterAsyncMutate } = useMutation({
    mutationFn: async () => {
      const res = await chapterPublishById(chapterId);
      if (!res.success)
        throw new Error(res.error || "Failed to publish chapter");
      return res;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [`chapters-${chapterId}`] });
      if (data.success) {
        ToastMessage({ message: data?.message, type: "success" });
      } else {
        ToastMessage({ message: data?.error || data?.message, type: "error" });
      }
    },
  });

  const { mutateAsync: unpublishChapterAsyncMutate } = useMutation({
    mutationFn: async () => {
      const res = await chapterUnpublishById(chapterId);
      if (!res.success)
        throw new Error(res.error || "Failed to unpublish chapter");
      return res;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [`chapters-${chapterId}`] });
      if (data.success) {
        ToastMessage({ message: data?.message, type: "success" });
      } else {
        ToastMessage({ message: data?.error || data?.message, type: "error" });
      }
    },
  });

  return (
    <>
      {status === "DRAFT" ? (
        <Button onClick={() => publishChapterAsyncMutate()}>Publish</Button>
      ) : (
        <Button onClick={() => unpublishChapterAsyncMutate()}>Unpublish</Button>
      )}
    </>
  );
};
