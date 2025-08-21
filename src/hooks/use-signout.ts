"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";

export function useSignOut() {
  const router = useRouter();

  async function handleLogOut() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login");
          toast.success("Signed out successfully !");
        },
        onError: () => {
          toast.error("Failed to signed out !");
        },
      },
    });
  }

  return handleLogOut;
}
