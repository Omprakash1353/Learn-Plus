import { db } from "@/db";
import { quizz } from "@/db/schema";

export async function adminGetQuizzez() {
  const data = await db
    .select({
      id: quizz.id,
      title: quizz.title,
      description: quizz.description,
      timeLimit: quizz.timeLimit,
    })
    .from(quizz);
  return data;
}

export type AdminGetQuizzezType = Awaited<ReturnType<typeof adminGetQuizzez>>[0];
