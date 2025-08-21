import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";

import { db } from "@/db";
import { enrollment as enrollmentTable } from "@/db/schema";
import { auth } from "@/lib/auth";

export async function checkIfCourseBought(courseId: string): Promise<boolean> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) return false;

  const enrollment = await db.query.enrollment.findFirst({
    where: and(
      eq(enrollmentTable.userId, session.user.id),
      eq(enrollmentTable.courseId, courseId)
    ),
    columns: {
      status: true,
    },
  });

  return enrollment?.status === "Active" ? true : false;
}
