import { db } from "@/lib/db";
import { validateRequest } from "@/lib/lucia";
import { CoursePage } from "./_components/course-filter";
import { eq } from "drizzle-orm";
import { courseTable } from "@/lib/db/schema";

export default async function HomePage() {
  const { user } = await validateRequest();

  const allTags = await db.query.tagTable.findMany({ columns: { name: true } });
  const courses = await db.query.courseTable.findMany({
    where: eq(courseTable.status, "PUBLISHED"),
    with: {
      tags: {
        with: {
          tag: true,
        },
        columns: {
          courseId: false,
          tagId: false,
        },
      },
      chapters: {
        columns: {
          id: true,
        },
      },
    },
    columns: {
      id: true,
      title: true,
      price: true,
      thumbnailUrl: true,
    },
  });

  const parsedTags = allTags.map((e) => e.name);
  const parsedCourses = courses.map((e) => {
    return {
      ...e,
      chapters: e.chapters.length,
      tags: e.tags.map((e) => e.tag.name),
      duration: 32,
    };
  });

  console.log(user, parsedTags);
  console.log(parsedCourses);

  return <CoursePage tags={["all", ...parsedTags]} cardsData={parsedCourses} />;
}
