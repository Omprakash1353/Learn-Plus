import { redirect } from "next/navigation";

import { validateRequest } from "@/lib/lucia";
import { ProblemTable } from "./_components/problems-table";

export default async function ProblemsManagePage() {
  const { user } = await validateRequest();
  if (!user || user.role !== "ADMIN") return redirect("/");

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <ProblemTable />
    </div>
  );
}
