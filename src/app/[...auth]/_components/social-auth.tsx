import {
  createGithubAuthorizationURL,
  createGoogleAuthorizationURL,
} from "@/actions/auth.action";
import { Icons } from "@/components/icons";
import { ToastMessage } from "@/components/toast";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";
import { usePathname } from "next/navigation";

export const SocialAuth = () => {
  const pathname = usePathname();
  const role = pathname === "/auth/instructor" ? "INSTRUCTOR" : "STUDENT";

  const onGoogleSignInAuth = async () => {
    const res = await createGoogleAuthorizationURL(role);
    if (res.error) {
      ToastMessage({ message: res.error, type: "error" });
    } else if (res.success) {
      console.debug(res.data);
      if (res.data) window.location.href = res.data?.toString();
    }
  };

  const onGithubSignInAuth = async () => {
    const res = await createGithubAuthorizationURL(role);
    if (res.error) {
      ToastMessage({ message: res.error, type: "error" });
    } else if (res.success) {
      if (res.data) window.location.href = res.data?.toString();
    }
  };

  return (
    <div className="grid grid-cols-2 gap-6">
      <Button variant="outline" onClick={onGithubSignInAuth}>
        <Github className="mr-2" />
        Github
      </Button>
      <Button variant="outline" onClick={onGoogleSignInAuth}>
        <Icons.google className="mr-2" />
        Google
      </Button>
    </div>
  );
};
