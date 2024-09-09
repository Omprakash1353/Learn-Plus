import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CoursesTable } from "./_components/courses-table";
import { db } from "@/lib/db";
import { validateRequest } from "@/lib/lucia";
import { redirect } from "next/navigation";

export default async function InstructorDashboard() {
  const { user } = await validateRequest();
  if (!user || user.role === "STUDENT") return redirect("/");

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <Card className="col-span-5">
        <CardHeader>
          <CardTitle>Your Courses</CardTitle>
          <CardDescription>
            Manage and monitor your course catalog
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CoursesTable />
        </CardContent>
      </Card>
    </div>
  );
}
