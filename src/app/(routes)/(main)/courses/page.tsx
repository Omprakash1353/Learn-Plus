import { getCourseData } from "@/constants/course-topics";
import { CoursePage } from "./_components/course-filter";
import { validateRequest } from "@/lib/lucia";

export default async function HomePage() {
  const { tags, cardsData } = await getCourseData();
  const { user } = await validateRequest();
  console.log(user);
  return <CoursePage tags={tags} cardsData={cardsData} />;
}
