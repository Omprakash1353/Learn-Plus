import { redirect } from "next/navigation";

import { validateRequest } from "@/lib/lucia";
import { TagManage } from "./_components/tag-manage";

export default async function MorePage() {
  const { user } = await validateRequest();
  if (!user || user.role !== "ADMIN") return redirect("/");

  return <TagManage />;
}
