"use client";

import { Loader2, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";

export function LoginForm() {
  const router = useRouter();
  const [googlePending, startGoogleTransition] = useTransition();
  const [emailPending, startEmailTransition] = useTransition();
  const [email, setEmail] = useState("");

  async function googleSignIn() {
    startGoogleTransition(async () => {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
        fetchOptions: {
          onSuccess: () => {
            toast.success(
              "Successfully signed in with Google, you will be redirected..."
            );
          },
          onError: (error) => {
            toast.error(error.error.message);
          },
        },
      });
    });
  }

  function emailSignIn() {
    startEmailTransition(async () => {
      await authClient.emailOtp.sendVerificationOtp({
        email,
        type: "sign-in",
        fetchOptions: {
          onSuccess: () => {
            toast.success("Email sent");
            router.push(`/verify-request?email=${email}`);
          },
          onError: () => {
            toast.error("Error sending email");
          },
        },
      });
    });
  }

  return (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle className="text-xl">Welcome back !</CardTitle>
        <CardDescription>
          Login with your Google or Email Account
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <Button
          disabled={googlePending}
          variant="outline"
          className="w-full"
          onClick={googleSignIn}
        >
          {googlePending ? (
            <>
              {" "}
              <Loader2 className="size-4 animate-spin" />{" "}
              <span>Loading...</span>
            </>
          ) : (
            <>
              {" "}
              <svg
                viewBox="-3 0 262 262"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="xMidYMid"
                fill="#000000"
              >
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  <path
                    d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                    fill="#4285F4"
                  ></path>
                  <path
                    d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                    fill="#34A853"
                  ></path>
                  <path
                    d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
                    fill="#FBBC05"
                  ></path>
                  <path
                    d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                    fill="#EB4335"
                  ></path>
                </g>
              </svg>
              Sign in with Google{" "}
            </>
          )}
        </Button>

        <div className="after:top-1/2 after:z-0 after:absolute relative after:inset-0 after:flex after:items-center after:border-t after:border-border text-sm text-center">
          <span className="z-10 relative bg-card px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>

        <div className="gap-3 grid">
          <div className="gap-2 grid">
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              placeholder="m@example.com"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
            />
          </div>

          <Button onClick={emailSignIn} disabled={emailPending}>
            {emailPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />{" "}
                <span>Loading...</span>
              </>
            ) : (
              <>
                <Send className="size-4" /> <span>Continue with Email</span>
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
