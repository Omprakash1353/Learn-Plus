import { validateRequest } from "@/lib/lucia";
import { redirect } from "next/navigation";
import { AdminCourseTable } from "./_components/courses-table";

export default async function AdminCoursesManagePage() {
  const { user } = await validateRequest();
  if (!user || user.role !== "ADMIN") return redirect("/");

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Courses</h2>
      </div>
      <AdminCourseTable />
    </div>
  );
}
