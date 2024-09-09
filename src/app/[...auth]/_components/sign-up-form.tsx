"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { resendVerificationEmail, signUp } from "@/actions/auth.action";
import { ToastMessage } from "@/components/toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { useCountdown } from "usehooks-ts";
import { SocialAuth } from "./social-auth";

export const signUpSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: "Name must be atleast 3 characters long" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(8, { message: "Password must be atleast 8 characters long" }),
    confirmPassword: z
      .string()
      .min(8, { message: "Password must be atleast 8 characters long" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export function SignUpForm() {
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

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof signUpSchema>) {
    const res = await signUp(values);
    startCountdown();
    if (res.error) {
      ToastMessage({ message: res.error, type: "error" });
    } else if (res.success) {
      ToastMessage({ message: res.message!, type: "success" });
      setShowResendVerificationEmail(true);
    }
  }

  const onResendVerificationEmail = async () => {
    const res = await resendVerificationEmail(form.getValues("email"));
    if (res.error) {
      ToastMessage({ message: res.error, type: "error" });
    } else if (res.success) {
      ToastMessage({ message: res.message!, type: "success" });
    }
  };

  return (
    <Card className="w-[700px] p-2 shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-xl">Sign Up</CardTitle>
        <CardDescription>
          Enter your details below to signIn with your account
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <SocialAuth />
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
        <Form {...form}>
          <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Name <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Email <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-5">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Password <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Confirm Password <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" className="grid">
              Sign Up
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
      <CardFooter className="flex items-center justify-center text-sm font-medium">
        By signing in, you agree to our&nbsp;&nbsp;
        <span className="cursor-pointer text-blue-800 underline">
          Terms of Service
        </span>
      </CardFooter>
    </Card>
  );
}
