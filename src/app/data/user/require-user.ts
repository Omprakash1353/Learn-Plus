import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";

import { auth } from "@/lib/auth";

export const requireUser = cache(async () => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return redirect("/login");
  }

  return session.user;
});
