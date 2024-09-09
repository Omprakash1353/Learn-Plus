import { getCourseData } from "@/constants/course-topics";
import { CoursePage } from "./_components/course-filter";

export default async function HomePage() {
  const { tags, cardsData } = await getCourseData();
  return <CoursePage tags={tags} cardsData={cardsData} />;
}
