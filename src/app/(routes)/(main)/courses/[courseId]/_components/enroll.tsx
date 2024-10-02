"use client";

import { Button } from "@/components/ui/button";
import { useSession } from "@/contexts/session-provider";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { enrollCourse, hasEnrolled } from "../_action";
import { ToastMessage } from "@/components/toast";
import { useState } from "react";
import { Loader } from "lucide-react";
import { queryClient } from "@/contexts/query-provider";

export const Enrollment = ({ courseId }: { courseId: string }) => {
  const { user } = useSession();
  const router = useRouter();

  const [isEnrolled, setIsEnrolled] = useState(false);

  const { mutateAsync: enroll } = useMutation({
    mutationFn: async () => {
      const res = await enrollCourse(courseId);
      if (!res) throw new Error("Failed to enroll course");

      return res;
    },
    onSuccess: (data) => {
      if (data.success) {
        ToastMessage({ message: data?.message!, type: "success" });
        setIsEnrolled(true);
        queryClient.invalidateQueries({
          queryKey: [`hasEnrolled-${courseId}`],
        });
      } else {
        ToastMessage({
          message: data.error || data?.message || "Something went wrong",
          type: "error",
        });
      }
    },
  });

  const { data: enrollmentData, isLoading } = useQuery({
    queryKey: [`hasEnrolled-${courseId}`],
    queryFn: async () => {
      const res = await hasEnrolled(courseId);
      if (!res) throw new Error("Failed to check if user has enrolled");

      return res;
    },
    enabled: !!user,
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  console.log(enrollmentData);

  if (isLoading)
    return (
      <Button className="w-full" size="lg">
        <Loader className="mr-2 h-4 w-4 animate-spin" />
      </Button>
    );

  if (!user)
    return (
      <Button className="w-full" size="lg" onClick={() => router.push("/auth")}>
        Enroll Now
      </Button>
    );

  return isEnrolled || enrollmentData?.hasEnrolled === true ? (
    <Button
      className="w-full"
      size="lg"
      onClick={() =>
        router.push(
          `/courses/${courseId}/${enrollmentData?.data?.currentChapter}`,
        )
      }
    >
      Continue
    </Button>
  ) : (
    <Button className="w-full" size="lg" onClick={async () => await enroll()}>
      Enroll Now
    </Button>
  );
};
