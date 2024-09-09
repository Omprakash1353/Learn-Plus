"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { contactAction } from "@/actions/contact.action";

export const contactUsForm = z.object({
  email: z.string().email({ message: "Invalid Email" }),
  message: z
    .string()
    .min(5, { message: "Message must be at least 5 characters long." }),
});

export function ContactForm() {
  const form = useForm<z.infer<typeof contactUsForm>>({
    resolver: zodResolver(contactUsForm),
    defaultValues: {
      email: "",
      message: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof contactUsForm>) => {
    const res = await contactAction(values);
    console.log(res);
  };

  return (
    <Card className="w-[400px] border-none p-2 text-start shadow-none outline-none">
      <CardHeader className="space-y-1">
        <h2 className="animate-fade-in -translate-y-4 text-balance bg-gradient-to-br from-black from-30% to-black/40 bg-clip-text py-0 text-4xl font-semibold leading-none text-transparent [--animation-delay:200ms] dark:from-white dark:to-white/40 sm:text-6xl md:text-7xl lg:text-2xl">
          Contact Us
        </h2>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Form {...form}>
          <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="example@mail.com"
                      autoComplete="off"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={8}
                      {...field}
                      placeholder="Tell us the question you wanted to  ask"
                      autoComplete="off"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Submit
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
