import { createAuthClient } from "better-auth/react";
import { emailOTPClient, adminClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  plugins: [emailOTPClient(), adminClient()],
});
