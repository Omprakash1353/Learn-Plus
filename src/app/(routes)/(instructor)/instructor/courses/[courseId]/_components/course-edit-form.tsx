"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Loader2, TagIcon } from "lucide-react";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { editCourse } from "@/actions/course.action";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutation, useQuery } from "@tanstack/react-query";
import { courseByIdAction } from "../_action";
import { ToastMessage } from "@/components/toast";
import { queryClient } from "@/contexts/query-provider";

export const courseEditSchema = z.object({
  title: z
    .string()
    .min(2, { message: "Title must be at least 2 characters." })
    .refine((val) => val.trim() !== "", { message: "Title cannot be empty." }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters." })
    .refine((val) => val.trim() !== "", {
      message: "Description cannot be empty.",
    }),
  price: z
    .string()
    .refine((val) => !isNaN(Number(val)), {
      message: "Price must be a valid number.",
    })
    .refine((val) => Number(val) >= 0, {
      message: "Price must be greater than 0.",
    }),
  isPublished: z.boolean().default(false),
  tags: z
    .array(z.object({ id: z.string(), name: z.string() }))
    .min(0, { message: "Please select at least one tag." })
    .refine((val) => new Set(val).size === val.length, {
      message: "Tags must be unique.",
    }),
  thumbnail: z.any().optional(),
});

const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

export function CourseEditForm({
  courseId,
  tags: predefinedTags,
}: {
  courseId: string;
  tags: { id: string; name: string }[];
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [thumbnail, setThumbnail] = useState<File | null>(null);

  const {
    data: courseData,
    isLoading,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: [`course-${courseId}`],
    queryFn: async () => {
      const res = await courseByIdAction(courseId);
      return res.data;
    },
    enabled: !!courseId,
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  const { mutateAsync: courseUpdateMutation } = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await editCourse(formData);
      return res;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [`course-${courseId}`] });
      if (data.success) {
        ToastMessage({ message: data.message, type: "success" });
      } else {
        ToastMessage({ message: data.error || data.message, type: "error" });
      }
    },
  });

  const form = useForm<z.infer<typeof courseEditSchema>>({
    resolver: zodResolver(courseEditSchema),
    mode: "onChange",
    defaultValues: {
      title: courseData?.title || "",
      description: courseData?.description || "",
      price: courseData?.price?.toString() || "0",
      isPublished: courseData?.status === "PUBLISHED" ? true : false,
      thumbnail: courseData?.thumbnailUrl || "",
      tags: courseData?.tags || [],
    },
  });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles[0]) {
        setThumbnail(acceptedFiles[0]);
        form.setValue("thumbnail", acceptedFiles[0]); // Set thumbnail in form state
      }
    },
    accept: { "image/*": [] },
    maxSize: 1024 * 1024, // 1MB
    maxFiles: 1,
  });

  const getChangedValues = useCallback(
    (values: z.infer<typeof courseEditSchema>) => {
      const changedData: Partial<z.infer<typeof courseEditSchema>> = {};

      if (values.title !== courseData?.title) changedData.title = values.title;
      if (values.description !== courseData?.description)
        changedData.description = values.description;
      if (values.price !== courseData?.price?.toString())
        changedData.price = values.price;
      if (JSON.stringify(values.tags) !== JSON.stringify(courseData?.tags))
        changedData.tags = values.tags;

      if (thumbnail) {
        changedData.thumbnail = thumbnail;
      }

      return changedData;
    },
    [thumbnail, courseData],
  );

  const onSubmit = useCallback(
    async (values: z.infer<typeof courseEditSchema>) => {
      try {
        setIsSubmitting(true);
        const changedValues = getChangedValues(values);

        const formData = new FormData();
        formData.set("id", courseId);

        Object.entries(changedValues).forEach(([key, value]) => {
          if (key === "thumbnail" && thumbnail) {
            formData.append(key, thumbnail);
          } else if (key === "tags") {
            values.tags.forEach((tag) => formData.append("tag", tag.id));
          } else {
            formData.append(key, value as string | Blob);
          }
        });

        await courseUpdateMutation(formData);
      } catch (error) {
        console.error("Submission error:", error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [thumbnail, getChangedValues],
  );

  useEffect(() => {
    form.reset({
      title: courseData?.title || "",
      description: courseData?.description || "",
      price: courseData?.price?.toString() || "0",
      isPublished: courseData?.status === "PUBLISHED" ? true : false,
      thumbnail: courseData?.thumbnailUrl || "",
      tags: courseData?.tags || [],
    });
  }, [courseData]);

  const isFormDisabled = isLoading || isFetching || isSubmitting;

  if (isLoading || isFetching) {
    return (
      <div className="grid grid-cols-5 items-start justify-start gap-x-8 gap-y-4">
        <Skeleton className="col-span-3 h-[500px] w-full" />
        <div className="col-span-2 grid gap-y-8">
          <Skeleton className="h-[250px] w-full" />
          <Skeleton className="h-[150px] w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    );
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-5 gap-8">
          <div className="col-span-3 space-y-8">
            {/* Course Details */}
            <Card>
              <CardHeader>
                <CardTitle>Course Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Course Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter course title"
                          {...field}
                          disabled={isFormDisabled}
                        />
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
                      <FormLabel>Course Description</FormLabel>
                      <FormControl>
                        <Editor
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Write a compelling description of your course..."
                          disabled={isFormDisabled}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price (USD)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter price"
                          {...field}
                          disabled={isFormDisabled}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          <div className="col-span-2 space-y-8">
            {/* Course Thumbnail */}
            <FormField
              control={form.control}
              name="thumbnail"
              render={({ field }) => (
                <Card>
                  <CardHeader>
                    <FormLabel>Course Thumbnail</FormLabel>
                    <FormMessage />
                  </CardHeader>
                  <CardContent>
                    <div
                      {...getRootProps()}
                      className={`cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
                        isDragActive
                          ? "border-primary bg-primary/10"
                          : "border-muted"
                      } ${isFormDisabled ? "pointer-events-none opacity-50" : ""}`}
                    >
                      <input {...getInputProps()} />
                      {thumbnail || courseData?.thumbnailUrl ? (
                        <div className="space-y-2">
                          <img
                            src={
                              thumbnail
                                ? URL.createObjectURL(thumbnail)
                                : courseData?.thumbnailUrl || undefined
                            }
                            alt="Course preview"
                            className="mx-auto max-h-48 rounded-md object-cover shadow-md"
                          />
                          <p className="text-sm text-muted-foreground">
                            {thumbnail?.name || courseData?.thumbnailUrl}
                          </p>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setThumbnail(null);
                              form.setValue("thumbnail", "");
                            }}
                          >
                            Remove Image
                          </Button>
                        </div>
                      ) : (
                        <div>
                          <TagIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                          <p className="mt-2 font-medium">
                            Drag &apos;n&apos; drop an image here, or click to
                            select one
                          </p>
                          <p className="text-sm text-muted-foreground">
                            (Max size: 1MB)
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            />

            {/* Course Tags */}
            <Card>
              <CardHeader>
                <CardTitle>Course Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-between"
                            disabled={isFormDisabled}
                          >
                            {field.value.length > 0
                              ? `${field.value.length} tag(s) selected`
                              : "Select Tags"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent>
                          <ScrollArea className="h-48 p-2">
                            <div className="space-y-2">
                              {predefinedTags.map((tag) => (
                                <div
                                  key={tag.id}
                                  className="flex items-center space-x-2"
                                >
                                  <Badge
                                    variant={
                                      field.value.some(
                                        (selectedTag) =>
                                          selectedTag.id === tag.id,
                                      )
                                        ? "default"
                                        : "outline"
                                    }
                                    onClick={() => {
                                      if (isFormDisabled) return;
                                      const tagExists = field.value.some(
                                        (selectedTag) =>
                                          selectedTag.id === tag.id,
                                      );

                                      const newTags = tagExists
                                        ? field.value.filter(
                                            (t) => t.id !== tag.id,
                                          )
                                        : [...field.value, tag];

                                      field.onChange(newTags);
                                    }}
                                    className={`cursor-pointer ${isFormDisabled ? "opacity-50" : ""}`}
                                  >
                                    {tag.name}
                                    {field.value.some(
                                      (selectedTag) =>
                                        selectedTag.id === tag.id,
                                    ) && <Check className="ml-2 h-3 w-3" />}
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          </ScrollArea>
                        </PopoverContent>
                      </Popover>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
            <FormField
              control={form.control}
              name="isPublished"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                        />
                        <span className="slider" />
                      </label>
                      <span>Publish Course</span>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isFormDisabled}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Course"
              )}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
