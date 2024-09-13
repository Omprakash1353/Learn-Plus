import { db } from "@/lib/db";
import { eq, ne, not } from "drizzle-orm";
import { UsersManageTable } from "../_components/charts/user-manage-table";
import { userTable } from "@/lib/db/schema";
import { validateRequest } from "@/lib/lucia";
import { redirect } from "next/navigation";

export type userManageTableType = {
  id: string;
  name: string;
  email: string;
  role: "INSTRUCTOR" | "STUDENT";
  profilePictureUrl: string;
  oauthAccounts: { id: string; provider: "google" | "github" };
}[];

export default async function UsersManagePage() {
  const { user, session } = await validateRequest();
  if (!user || !session) return redirect("/");

  const users = (await db.query.userTable.findMany({
    with: {
      oauthAccounts: {
        columns: {
          id: true,
          provider: true,
        },
      },
    },
    where: ne(userTable.role, "ADMIN"),
    columns: {
      id: true,
      name: true,
      email: true,
      role: true,
      profilePictureUrl: true,
    },
  })) as userManageTableType;

  return (
    <>
      <UsersManageTable users={users} />
    </>
  );
}
