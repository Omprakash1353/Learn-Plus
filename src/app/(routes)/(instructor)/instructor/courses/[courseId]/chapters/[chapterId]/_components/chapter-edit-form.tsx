"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

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
import { Switch } from "@/components/ui/switch";
import { queryClient } from "@/contexts/query-provider";
import { chapterByIdAction, chapterUpdateByIdAction } from "../_action";

const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

export const chapterEditSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  isFree: z.boolean(),
  isPublished: z.boolean(),
  video: z.instanceof(File).optional(),
});

export function ChapterEditForm({
  courseId,
  chapterId,
}: {
  courseId: string;
  chapterId: string;
}) {
  const { data: chapterData } = useQuery({
    queryKey: [`chapter-${chapterId}-${courseId}`],
    queryFn: async () => {
      const res = await chapterByIdAction(courseId, chapterId);
      return res.data;
    },
    enabled: !!courseId,
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  const { mutateAsync: updateChapterAsyncMutate } = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await chapterUpdateByIdAction(courseId, chapterId, formData);
      if (!res.success)
        throw new Error(res.error || "Failed to update chapter");
      return res;
    },
    onSuccess: (data) => {
      setIsSubmitting(false);
      if (data.success) {
        ToastMessage({ message: data?.message!, type: "success" });
      } else {
        ToastMessage({ message: data?.message || data?.error!, type: "error" });
      }
      queryClient.invalidateQueries({
        queryKey: [`chapters-${chapterId}-${courseId}`],
      });
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const getChangedValues = useCallback(
    (values: z.infer<typeof chapterEditSchema>) => {
      const changedData: Partial<z.infer<typeof chapterEditSchema>> = {};

      if (values.title !== chapterData?.title) changedData.title = values.title;
      if (values.description !== chapterData?.description)
        changedData.description = values.description;

      return changedData;
    },
    [chapterData],
  );

  const form = useForm<z.infer<typeof chapterEditSchema>>({
    resolver: zodResolver(chapterEditSchema),
    defaultValues: {
      title: "",
      description: "",
      isFree: false,
      isPublished: false,
    },
  });

  useEffect(() => {
    form.reset({
      title: chapterData?.title || "",
      description: chapterData?.description || "",
      isFree: chapterData?.isFree || false,
      isPublished: chapterData?.status === "PUBLISHED" ? true : false,
    });
  }, [form]);

  const onSubmit = useCallback(
    async (values: z.infer<typeof chapterEditSchema>) => {
      setIsSubmitting(true);
      console.log(values);
      const changedValues = getChangedValues(values);
      const formData = new FormData();
      Object.entries(changedValues).forEach(([key, value]) => {
        formData.append(key, value as string);
      });

      await updateChapterAsyncMutate(formData);
    },
    [],
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter chapter title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Editor
                  onChange={field.onChange}
                  value={field.value}
                  placeholder="Enter chapter description..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isFree"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Free Chapter</FormLabel>
                <FormDescription>
                  Make this chapter free for preview
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isPublished"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Publish</FormLabel>
                <FormDescription>
                  Make this chapter available to students
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="video"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Chapters List</FormLabel>
              <FormControl>
                {/* <ChapterLists /> */}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </Form>
  );
}
