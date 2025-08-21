import Link from "next/link";
import { Suspense } from "react";

import { EmptyState } from "@/components/general/empty-state";
import { ChartAreaInteractive } from "@/components/sidebar/chart-area-interactive";
import { SectionCards } from "@/components/sidebar/section-cards";
import { buttonVariants } from "@/components/ui/button";
import { adminGetEnrollmentStats } from "../data/admin/admin-get-enrollment-stats";
import { adminGetRecentCourses } from "../data/admin/admin-get-recent-courses";
import {
  AdminCourseCard,
} from "./courses/_components/admin-course-card";
import { CourseCardSkeleton } from "@/components/course/course-card-skeleton";

export default async function AdminIndexPage() {
  const enrollmentData = await adminGetEnrollmentStats();

  return (
    <>
      <SectionCards role="admin" />
      <ChartAreaInteractive data={enrollmentData} />
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-xl">Recent Courses</h2>
          <Link
            className={buttonVariants({ variant: "outline" })}
            href="/admin/courses"
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
  const data = await adminGetRecentCourses();

  if (data.length === 0) {
    return (
      <EmptyState
        buttonText="Create new Course"
        description="you don't have any courses. Create some to see them here"
        title="You don't have any courses yet !"
        href="/admin/courses/create"
      />
    );
  }

  return (
    <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
      {data.map((course) => (
        <AdminCourseCard key={course.id} data={course} />
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
