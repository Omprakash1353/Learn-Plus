import { getCourseSidebarData } from "@/app/data/course/get-course-sidebar-data";
import { CourseLayoutClient } from "../_components/course-layout-client";

export default async function CourseLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { course } = await getCourseSidebarData(slug);

  return <CourseLayoutClient course={course}>{children}</CourseLayoutClient>;
}
