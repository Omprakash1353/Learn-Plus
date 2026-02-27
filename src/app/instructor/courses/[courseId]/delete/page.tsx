"use client";

import Link from "next/link";
import { useTransition } from "react";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { tryCatch } from "@/hooks/try-catch";
import { deleteCourse } from "./actions";

export default function DeleteCoursePage() {
  const [pending, startTransition] = useTransition();
  const { courseId } = useParams<{ courseId: string }>();
  const router = useRouter();

  function handleDelete() {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(deleteCourse(courseId));

      if (error) {
        toast.error("An unexpected error occurred. Please try again");
        return;
      }

      if (result.status === "success") {
        toast.success(result.message);
        router.push("/instructor/courses");
      } else if (result.status === "error") {
        toast.error(result.message);
      }
    });
  }

  return (
    <div className="mx-auto w-full max-w-xl">
      <Card className="mt-32">
        <CardHeader>
          <CardTitle>Do you want to delete this course ?</CardTitle>
          <CardDescription>This action cannot be undone</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-between items-center">
          <Link
            className={buttonVariants({ variant: "outline" })}
            href={`/instructor/courses`}
          >
            Cancel
          </Link>
          <Button variant="destructive" onClick={handleDelete}>
            {pending ? "Deleting..." : "Delete"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
