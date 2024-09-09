"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Loader2, Tag as TagIcon } from "lucide-react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import dynamic from "next/dynamic";

const predefinedTags = [
  "JavaScript",
  "React",
  "Node.js",
  "CSS",
  "HTML",
  "TypeScript",
  "GraphQL",
  "Next.js",
  "Express",
  "Vue.js",
  "Angular",
  "Python",
  "Django",
  "Flask",
  "Ruby",
  "Rails",
  "PHP",
  "Laravel",
  "Java",
  "Spring",
  "C#",
  ".NET",
  "SQL",
  "MongoDB",
  "PostgreSQL",
  "Redis",
  "Docker",
  "Kubernetes",
  "AWS",
  "Azure",
  "GCP",
  "DevOps",
  "CI/CD",
  "Machine Learning",
  "Artificial Intelligence",
  "Data Science",
  "Blockchain",
  "Cryptocurrency",
  "IoT",
  "Mobile Development",
  "iOS",
  "Android",
  "React Native",
  "Flutter",
  "Unity",
  "Game Development",
];

const formSchema = z.object({
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
    .refine((val) => Number(val) > 0, {
      message: "Price must be greater than 0.",
    }),
  isPublished: z.boolean().default(false),
  tags: z
    .array(z.string())
    .min(1, { message: "Please select at least one tag." })
    .refine((val) => new Set(val).size === val.length, {
      message: "Tags must be unique.",
    }),
  thumbnail: z.instanceof(File, { message: "Thumbnail is required" }),
});

const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

export default function CourseEditPage({
  params,
}: {
  params: { courseId: string };
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [thumbnail, setThumbnail] = useState<File | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      description: "",
      price: "",
      isPublished: false,
      tags: [],
    },
  });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles[0]) {
        setThumbnail(acceptedFiles[0]);
      }
    },
    accept: { "image/*": [] },
    maxSize: 1024 * 1024,
    maxFiles: 1,
  });

  const onSubmit = useCallback(
    (values: z.infer<typeof formSchema>) => {
      setIsSubmitting(true);

      setTimeout(() => {
        console.log(values, thumbnail);
        setIsSubmitting(false);
      }, 2000);
    },
    [thumbnail],
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
        Create New Course
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                      <Input placeholder="Enter course title" {...field} />
                    </FormControl>
                    <FormDescription>
                      Choose a catchy and descriptive title for your course.
                    </FormDescription>
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
                      />
                    </FormControl>
                    <FormDescription>
                      Provide a detailed overview of what students will learn in
                      your course.
                    </FormDescription>
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
                      />
                    </FormControl>
                    <FormDescription>
                      Set a competitive price for your course. Enter 0 for a
                      free course.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <FormField
            control={form.control}
            name="thumbnail"
            render={({ field }) => {
              return (
                <Card>
                  <CardHeader>
                    <FormLabel>Course Thumbnail</FormLabel>
                    <FormDescription>
                      Upload a high-quality image that will be used as the
                      course thumbnail.
                    </FormDescription>
                    <FormMessage />
                  </CardHeader>
                  <CardContent>
                    <div
                      {...getRootProps()}
                      className={`cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
                        isDragActive
                          ? "border-primary bg-primary/10"
                          : "border-muted"
                      }`}
                    >
                      <input {...getInputProps()} onChange={field.onChange} />
                      {field.value ? (
                        <div className="space-y-2">
                          <img
                            src={URL.createObjectURL(field.value)}
                            alt="Course preview"
                            className="mx-auto max-h-48 rounded-md object-cover shadow-md"
                          />
                          <p className="text-sm text-muted-foreground">
                            {field.value.name}
                          </p>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => field.onChange(null)}
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
              );
            }}
          />

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
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={`w-full justify-between ${
                              field.value.length > 0 ? "h-full" : "h-10"
                            }`}
                          >
                            {field.value.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {field.value.map((tag) => (
                                  <Badge
                                    variant="secondary"
                                    key={tag}
                                    className="mb-1 mr-1"
                                  >
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            ) : (
                              "Select tags"
                            )}
                            <TagIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[300px] p-0">
                          <ScrollArea className="h-[300px]">
                            <div className="p-4">
                              {predefinedTags.map((tag) => (
                                <div
                                  key={tag}
                                  className="flex cursor-pointer items-center justify-between py-2 text-sm"
                                  onClick={() => {
                                    const updatedTags = field.value.includes(
                                      tag,
                                    )
                                      ? field.value.filter((t) => t !== tag)
                                      : [...field.value, tag];
                                    field.onChange(updatedTags);
                                  }}
                                >
                                  <span>{tag}</span>
                                  {field.value.includes(tag) && (
                                    <Check className="h-4 w-4" />
                                  )}
                                </div>
                              ))}
                            </div>
                          </ScrollArea>
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormDescription>
                      Select tags that best describe your course content.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting} size="lg">
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isSubmitting ? "Creating Course..." : "Create Course"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
