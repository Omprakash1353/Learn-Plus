import Link from "next/link";
import { Suspense } from "react";

import { CourseCardSkeleton } from "@/components/course/course-card-skeleton";
import { EmptyState } from "@/components/general/empty-state";
import { ChartAreaInteractive } from "@/components/sidebar/chart-area-interactive";
import { SectionCards } from "@/components/sidebar/section-cards";
import { buttonVariants } from "@/components/ui/button";
import { instructorGetEnrollmentStats } from "../data/instructor/instructor-get-enrollment-stats";
import { instructorGetRecentCourses } from "../data/instructor/instructor-get-recent-courses";
import { InstructorCourseCard } from "./courses/_components/instructor-course-card";

export default async function InstructorIndexPage() {
  const enrollmentData = await instructorGetEnrollmentStats();
  console.info("ENROLLMENT DATA", enrollmentData);

  return (
    <>
      <SectionCards role="instructor" />
      <ChartAreaInteractive data={enrollmentData} />
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-xl">Recent Courses</h2>
          <Link
            className={buttonVariants({ variant: "outline" })}
            href="/instructor/courses"
          >
            View All Courses
          </Link>
        </div>

        <Suspense fallback={<RenderRecentCoursesSkeletonLayout />}>
          <RenderRecentCourses />
        </Suspense>
      </div>
    </>
  );
}

async function RenderRecentCourses() {
  const data = await instructorGetRecentCourses();

  console.info("RECENT COURSES", data);

  if (data.length === 0) {
    return (
      <EmptyState
        buttonText="Create new Course"
        description="you don't have any courses. Create some to see them here"
        title="You don't have any courses yet !"
        href="/instructor/courses/create"
      />
    );
  }

  return (
    <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
      {data.map((course) => (
        <InstructorCourseCard key={course.id} data={course} />
      ))}
    </div>
  );
}

function RenderRecentCoursesSkeletonLayout() {
  return (
    <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
      {Array.from({ length: 2 }).map((_, index) => (
        <CourseCardSkeleton key={index} />
      ))}
    </div>
  );
}
