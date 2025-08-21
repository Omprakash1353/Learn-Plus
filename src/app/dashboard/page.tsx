
import { EmptyState } from "@/components/general/empty-state";
import { PublicCourseCard } from "../(public)/_components/public-course-card";
import { getAllCourses } from "../data/course/get-all-courses";
import { getEnrolledCourses } from "../data/user/get-enrolled-courses";
import { CourseProgressCard } from "./_components/course-progress-card";

export default async function DashboardPage() {
  const [courses, enrolledCourses] = await Promise.all([
    getAllCourses(),
    getEnrolledCourses(),
  ]);

  return (
    <>
      <div className="flex flex-col gap-2">
        <h1 className="font-bold text-3xl">Enrolled Courses</h1>
        <p className="text-muted-foreground">
          Here you can see all the courses you have access to
        </p>
      </div>

      {enrolledCourses.length === 0 ? (
        <EmptyState
          title="No courses purchased"
          description="You haven't purchased any courses yet"
          buttonText="Browse Courses"
          href="/courses"
        />
      ) : (
        <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
          {enrolledCourses.map((course) => (
            <div
              key={course.course.id}
            >
              <CourseProgressCard key={course.id} data={course} />
            </div>
          ))}
        </div>
      )}

      <section className="mt-10">
        <div className="flex flex-col gap-2 mb-5">
          <h1 className="font-bold text-3xl">Available Courses</h1>
          <p className="text-muted-foreground">
            Here you can see all the courses you can purchase
          </p>
        </div>

        {courses.filter(
          (course) =>
            !enrolledCourses.some(
              ({ course: enrolled }) => enrolled.id === course.id
            )
        ).length === 0 ? (
          <EmptyState
            title="No courses available"
            description="You have already purchased all courses available"
            buttonText="Browse Course"
            href="/courses"
          />
        ) : (
          <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
            {courses
              .filter(
                (course) =>
                  !enrolledCourses.some(
                    ({ course: enrolled }) => enrolled.id === course.id
                  )
              )
              .map((course) => (
                <PublicCourseCard key={course.id} data={course} />
              ))}
          </div>
        )}
      </section>
    </>
  );
}
