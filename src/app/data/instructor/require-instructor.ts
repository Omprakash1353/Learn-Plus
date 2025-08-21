import "server-only";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";

import { auth } from "@/lib/auth";

export const requireInstructor = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return redirect("/login");
  }

  console.info(session.user.role)

  if (
    session.user.role?.trim().toLowerCase() === "admin" ||
    session.user.role?.trim().toLowerCase() === "instructor"
  ) {
    return session;
  }

  return redirect("/not-admin");
});
