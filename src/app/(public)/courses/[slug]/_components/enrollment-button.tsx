"use client";

import { Loader2 } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { tryCatch } from "@/hooks/try-catch";
import { enrollInCourse } from "../actions";

export function EnrollmentButton({ courseId }: { courseId: string }) {
  const [pending, startTransition] = useTransition();

  function handleEnrollment() {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(enrollInCourse(courseId));

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
    <Button onClick={handleEnrollment} disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2 className="size-4 animate-spin" />
          Loading...
        </>
      ) : (
        "Enroll Now"
      )}
    </Button>
  );
}
