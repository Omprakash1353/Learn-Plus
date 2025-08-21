import Link from "next/link";
import { Suspense } from "react";

import { adminGetCourses } from "@/app/data/admin/admin-get-courses";
import { CourseCardSkeleton } from "@/components/course/course-card-skeleton";
import { EmptyState } from "@/components/general/empty-state";
import { buttonVariants } from "@/components/ui/button";
import { AdminCourseCard } from "./_components/admin-course-card";

export default function CoursesPage() {
  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="font-bold text-2xl">Your Courses</h1>

        <Link href="/admin/courses/create" className={buttonVariants()}>
          Create Course
        </Link>
      </div>

      <Suspense fallback={<AdminCourseCardSkeletonLayout />}>
        <RenderCourses />
      </Suspense>
    </>
  );
}

async function RenderCourses() {
  const data = await adminGetCourses();

  return (
    <>
      {data.length === 0 ? (
        <EmptyState
          title="No courses found"
          description="Create a new course to get started"
          buttonText="Create new Course"
          href="/admin/courses/create"
        />
      ) : (
        <div className="gap-7 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
          {data.map((course) => (
            <AdminCourseCard key={course.id} data={course} />
          ))}
        </div>
      )}
    </>
  );
}

function AdminCourseCardSkeletonLayout() {
  return (
    <div className="gap-7 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
      {Array.from({ length: 4 }).map((_, index) => (
        <CourseCardSkeleton key={index} />
      ))}
    </div>
  );
}
