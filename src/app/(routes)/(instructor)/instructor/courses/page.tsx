import { redirect } from "next/navigation";

import { validateRequest } from "@/lib/lucia";
import { CoursesTable } from "./_components/courses-table";

export type coursesDataType = {
  id: string;
  title: string;
  status: "PUBLISHED" | "DRAFT";
  students: number;
  price: number | null;
  rating: number | null;
  createdAt: Date;
  updatedAt: Date;
}[];

export default async function InstructorDashboard() {
  const { user } = await validateRequest();
  if (!user || user.role !== "INSTRUCTOR") return redirect("/");

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <CoursesTable userId={user.id} />
    </div>
  );
}
