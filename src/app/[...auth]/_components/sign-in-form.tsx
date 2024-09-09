"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useCountdown } from "usehooks-ts";
import { z } from "zod";

import { resendVerificationEmail, signIn } from "@/actions/auth.action";
import { ToastMessage } from "@/components/toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SocialAuth } from "./social-auth";

export const signInSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be atleast 8 characters long" }),
  role: z.enum(["ADMIN", "INSTRUCTOR", "STUDENT"]).default("STUDENT"),
});

export const SignInForm = () => {
  const router = useRouter();
  const pathname = usePathname();

  const [showResendVerificationEmail, setShowResendVerificationEmail] =
    useState(false);

  const [count, { startCountdown, stopCountdown, resetCountdown }] =
    useCountdown({
      countStart: 60,
      intervalMs: 1000,
    });

  useEffect(() => {
    if (count === 0) {
      stopCountdown();
      resetCountdown();
    }
  }, [count, stopCountdown, resetCountdown]);

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof signInSchema>) => {
    const res = await signIn({
      ...values,
      role: pathname === "auth/instructor" ? "INSTRUCTOR" : "STUDENT",
    });
    if (res.error) {
      ToastMessage({ message: res.error, type: "error" });
      if (res?.key === "email_not_verified") {
        setShowResendVerificationEmail(true);
      }
    } else if (res.success) {
      ToastMessage({ message: res.message, type: "success" });
      console.log(values);
      router.push(pathname === "auth/instructor" ? "/instructor" : "/");
    }
  };

  const onResendVerificationEmail = async () => {
    const res = await resendVerificationEmail(form.getValues("email"));
    if (res.error) {
      ToastMessage({ message: res.error, type: "error" });
    } else if (res.success) {
      ToastMessage({ message: res.message!, type: "success" });
      startCountdown();
    }
  };

  return (
    <Card className="p-2 shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-xl">Sign In</CardTitle>
        <CardDescription>
          Enter your email below to signIn with your account
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <SocialAuth />
        <Form {...form}>
          <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Email <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="m@example.com"
                      autoComplete="off"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Password <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} type="password" autoComplete="off" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </form>
          {showResendVerificationEmail && (
            <Button
              disabled={count > 0 && count < 60}
              onClick={onResendVerificationEmail}
              variant={"link"}
            >
              Send verification email {count > 0 && count < 60 && `in ${count}`}
            </Button>
          )}
        </Form>
      </CardContent>
    </Card>
  );
};
