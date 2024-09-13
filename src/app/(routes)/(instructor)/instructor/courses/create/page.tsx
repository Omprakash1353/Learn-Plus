"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { createCourse } from "@/actions/course.action";
import { ToastMessage } from "@/components/toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoaderCircle } from "lucide-react";

export const courseCreate = z.object({
  title: z.string().min(1, { message: "Title is required" }),
});

export default function Page() {
  const router = useRouter();

  const form = useForm<z.infer<typeof courseCreate>>({
    resolver: zodResolver(courseCreate),
    defaultValues: {
      title: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof courseCreate>) => {
    const res = await createCourse(values);
    if (res.success) {
      ToastMessage({ message: res.message, type: "success" });
      router.push(`/instructor/courses/${res.data?.courseId}`);
    } else {
      ToastMessage({ message: res?.error || res.message, type: "error" });
      form.setFocus("title");
    }
  };

  return (
    <div className="flex min-h-[80vh] w-full items-center justify-center sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight">
            Name your course
          </h2>
          <p className="mt-2 text-sm">
            What would you like to name your course? Don&apos;t worry you can
            edit it later
          </p>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-8 space-y-6"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Title</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="Course name"
                      {...field}
                      className="mt-1 block w-full rounded-md shadow-sm sm:text-sm"
                    />
                  </FormControl>
                  <FormDescription>
                    What will you teach in this course?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center justify-end gap-2">
              <Link href="/">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={!isValid || isSubmitting}>
                {form.formState.isSubmitting ? (
                  <LoaderCircle size={20} className="animate-spin" />
                ) : (
                  "Continue"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
