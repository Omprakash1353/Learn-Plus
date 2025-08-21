import { Suspense } from "react";

import { getAllCourses } from "@/app/data/course/get-all-courses";
import {
    PublicCourseCard,
    PublicCourseCardSkeleton,
} from "../_components/public-course-card";

export const dynamic = "force-dynamic"

export default function CoursePage() {
  return (
    <div className="mt-5">
      <div className="flex flex-col space-y-2 mb-10">
        <h1 className="font-bold text-3xl md:text-4xl tracking-tighter">
          Explore Courses
        </h1>
        <p className="text-muted-foreground">
          Discover our wide range of courses designed to help you achieve your
          learning goals
        </p>
      </div>

      <Suspense fallback={<LoadingSkeletonLayout />}>
        <RenderCourses />
      </Suspense>
    </div>
  );
}

async function RenderCourses() {
  const courses = await getAllCourses();

  return (
    <div className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {courses.map((course) => (
        <PublicCourseCard key={course.id} data={course} />
      ))}
    </div>
  );
}

function LoadingSkeletonLayout() {
  return (
    <div className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 9 }).map((_, index) => (
        <PublicCourseCardSkeleton key={index} />
      ))}
    </div>
  );
}
