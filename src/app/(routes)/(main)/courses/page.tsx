import { getCourseData } from "@/constants/course-topics";
import { CoursePage } from "./_components/course-filter";
import { validateRequest } from "@/lib/lucia";
import { db } from "@/lib/db";

export default async function HomePage() {
  const { cardsData } = await getCourseData();
  const { user } = await validateRequest();

  const allTags = await db.query.tagTable.findMany({ columns: { name: true } });
  const parsedTags = allTags.map((e) => e.name);
  console.log(user, parsedTags);

  return <CoursePage tags={["all", ...parsedTags]} cardsData={cardsData} />;
}
