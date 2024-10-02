"use client";

import { useMutation } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { publishCourseById, unpublishCourseById } from "../_action";

export const PublishCourse = ({
  courseId,
  course,
}: {
  courseId: string;
  course?: {
    status: "DRAFT" | "PUBLISHED";
    chapters: {
      status: "DRAFT" | "PUBLISHED";
    }[];
  };
}) => {
  const { mutateAsync: publishCourse } = useMutation({
    mutationFn: async () => {
      const res = await publishCourseById(courseId);
      if (!res.success)
        throw new Error(res.error || "Failed to publish course");
      return res;
    },
  });

  const { mutateAsync: unpublishCourse } = useMutation({
    mutationFn: async () => {
      const res = await unpublishCourseById(courseId);
      if (!res.success)
        throw new Error(res.error || "Failed to publish course");
      return res;
    },
  });

  return (
    <>
      {course?.status === "PUBLISHED" ? (
        <Button onClick={async () => await unpublishCourse()}>Unpublish</Button>
      ) : course?.chapters.some((chp) => chp.status === "PUBLISHED") ? (
        <Button onClick={async () => await publishCourse()}>Publish</Button>
      ) : null}
    </>
  );
};
