"use client";

import { editCourse } from "@/actions/course.action";
import { ToastMessage } from "@/components/toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { queryClient } from "@/contexts/query-provider";
import {
  courseByIdAction,
  createChapter,
  deleteChapterById,
  editCourseTitleById,
  getCourseChaptersById,
  reorderChaptersById,
} from "../_action";

import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Check,
  GripVertical,
  Loader2,
  Pen,
  Plus,
  TagIcon,
  Trash2,
} from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";

const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

const courseInfoSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters." }),
  price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
    message: "Price must be a valid number greater than or equal to 0.",
  }),
  tags: z.array(z.object({ id: z.string(), name: z.string() })),
  thumbnail: z.any().optional(),
});

const chapterSchema = z.object({
  id: z.string(),
  title: z
    .string()
    .min(2, { message: "Chapter title must be at least 2 characters." }),
  order: z.number().min(1, { message: "Order must be at least 1." }),
});

type CourseEditProps = {
  courseId: string;
  tags: { id: string; name: string }[];
};

export function CourseEditForm({ courseId, tags }: CourseEditProps) {
  const [thumbnail, setThumbnail] = useState<File | null>(null);

  const {
    data: courseData,
    isLoading,
    isError,
    isFetching,
    error,
  } = useQuery({
    queryKey: [`course-${courseId}`],
    queryFn: async () => {
      const res = await courseByIdAction(courseId);
      console.debug(res);
      return res.data;
    },
    enabled: !!courseId,
    refetchOnWindowFocus: false,
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

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles[0]) {
        setThumbnail(acceptedFiles[0]);
        courseInfoForm.setValue("thumbnail", acceptedFiles[0]);
      }
    },
    accept: { "image/*": [] },
    maxSize: 1024 * 1024,
    maxFiles: 1,
  });

  const courseInfoForm = useForm<z.infer<typeof courseInfoSchema>>({
    resolver: zodResolver(courseInfoSchema),
    defaultValues: {
      title: "",
      description: "",
      price: "0",
      tags: [],
      thumbnail: undefined,
    },
  });

  useEffect(() => {
    if (courseData) {
      courseInfoForm.reset({
        title: courseData.title || "",
        description: courseData.description || "",
        price: courseData.price?.toString() || "0",
        tags: courseData.tags || [],
        thumbnail: courseData.thumbnailUrl || "",
      });
    }
  }, [courseData, courseInfoForm]);

  const onCourseInfoSubmit = async (
    values: z.infer<typeof courseInfoSchema>,
  ) => {
    const formData = new FormData();
    formData.set("id", courseId);
    Object.entries(values).forEach(([key, value]) => {
      if (key === "thumbnail" && thumbnail) {
        formData.append(key, thumbnail);
      } else if (key === "tags") {
        values.tags.forEach((tag) => formData.append("tag", tag.id));
      } else {
        formData.append(key, value as string | Blob);
      }
    });
    await courseUpdateMutation(formData);
  };

  if (isLoading || isFetching) {
    return (
      <div className="grid grid-rows-1 gap-8 md:grid-rows-2">
        <Skeleton className="h-[600px] w-full" />
        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="space-y-8">
      <Form {...courseInfoForm}>
        <form
          onSubmit={courseInfoForm.handleSubmit(onCourseInfoSubmit)}
          className="space-y-8"
        >
          <Card>
            <CardHeader>
              <CardTitle>Course Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={courseInfoForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter course title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={courseInfoForm.control}
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
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={courseInfoForm.control}
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
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={courseInfoForm.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course Tags</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-between"
                        >
                          {field.value.length > 0
                            ? `${field.value.length} tag(s) selected`
                            : "Select Tags"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent>
                        <ScrollArea className="h-48 p-2">
                          <div className="space-y-2">
                            {tags.map((tag) => (
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
                                  className="cursor-pointer"
                                >
                                  {tag.name}
                                  {field.value.some(
                                    (selectedTag) => selectedTag.id === tag.id,
                                  ) && <Check className="ml-2 h-3 w-3" />}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={courseInfoForm.control}
                name="thumbnail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course Thumbnail</FormLabel>
                    <div
                      {...getRootProps()}
                      className={`cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
                        isDragActive
                          ? "border-primary bg-primary/10"
                          : "border-muted"
                      }`}
                    >
                      <input {...getInputProps()} />
                      {thumbnail || courseData?.thumbnailUrl ? (
                        <div className="space-y-2">
                          <Image
                            src={
                              thumbnail
                                ? URL.createObjectURL(thumbnail)
                                : courseData?.thumbnailUrl || ""
                            }
                            width={400}
                            height={200}
                            alt="Course preview"
                            className="mx-auto max-h-48 rounded-md object-cover shadow-md"
                          />
                          <p className="overflow-hidden text-ellipsis text-sm text-muted-foreground">
                            {thumbnail?.name || courseData?.thumbnailUrl}
                          </p>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setThumbnail(null);
                              field.onChange("");
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
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          <Button type="submit">Save Course Information</Button>
        </form>
      </Form>

      <Chapters courseId={courseId} />
    </div>
  );
}

export const chaptersSchema = z.array(chapterSchema);

interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  error?: string;
  data?: T;
}

export const chapterCreateSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters." }),
});

type Chapter = {
  id: string;
  title: string;
  order: number;
  status: "PUBLISHED" | "DRAFT";
};

export function Chapters({ courseId }: { courseId: string }) {
  const [hasOrderChanged, setHasOrderChanged] = useState(false);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [isCreateChapterOpen, setIsCreateChapterOpen] = useState(false);

  const form = useForm<z.infer<typeof chapterCreateSchema>>({
    resolver: zodResolver(chapterCreateSchema),
    defaultValues: {
      title: "",
    },
  });

  const { data: chaptersData } = useQuery({
    queryKey: [`course-${courseId}-chapters`],
    queryFn: async () => {
      const res = await getCourseChaptersById(courseId);
      if (!res) throw new Error("Course not found");
      setHasOrderChanged(false);
      return res.data;
    },
    enabled: !!courseId,
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  const { mutateAsync: deleteChapterAsyncMutate } = useMutation({
    mutationFn: async (chapterId: string) => {
      const res = await deleteChapterById(chapterId);
      if (!res.success)
        throw new Error(res.error || "Failed to delete chapter");
      return res;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [`course-${courseId}-chapters`],
      });
      if (data.success) {
        ToastMessage({ message: data?.message, type: "success" });
      } else {
        ToastMessage({ message: data?.error || data?.message, type: "error" });
      }
    },
  });

  const { mutateAsync: createChapterMutate } = useMutation({
    mutationFn: async (values: { title: string }) => {
      const res = await createChapter(courseId, values.title);
      return res;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [`course-${courseId}-chapters`],
      });
      if (data.success) {
        ToastMessage({ message: data?.message, type: "success" });
        setIsCreateChapterOpen(false);
        form.reset();
      } else {
        ToastMessage({ message: data?.error || data?.message, type: "error" });
      }
    },
  });

  const { mutateAsync: updateChapterTitleMutate } = useMutation({
    mutationFn: async (values: { chapterId: string; title: string }) => {
      const res = await editCourseTitleById(values.chapterId, values.title);
      if (!res.success)
        throw new Error(res.error || "Failed to update chapter title");
      return res;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [`course-${courseId}-chapters`],
      });
      if (data.success) {
        ToastMessage({ message: data?.message, type: "success" });
      } else {
        ToastMessage({ message: data?.error || data?.message, type: "error" });
      }
    },
  });

  const { mutateAsync: reorderChaptersMutate } = useMutation({
    mutationFn: async (updatedChapters: Chapter[]) => {
      const res = await reorderChaptersById(courseId, updatedChapters);
      if (!res.success)
        throw new Error(res.error || "Failed to reorder chapters");
      return res;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [`course-${courseId}-chapters`],
      });
      if (data.success) {
        ToastMessage({ message: data?.message, type: "success" });
      } else {
        ToastMessage({ message: data?.error || data?.message, type: "error" });
      }
    },
  });

  useEffect(() => {
    if (chaptersData) setChapters(chaptersData);
    return () => {
      setChapters([]);
    };
  }, [chaptersData]);

  const handleOrderChange = async (updatedChapters: Chapter[]) => {
    console.debug(updatedChapters);
    await reorderChaptersMutate(updatedChapters);
    setHasOrderChanged(false);
  };

  const reorderChapters = (updatedChapters: Chapter[]) => {
    setHasOrderChanged(true);
    return updatedChapters.map((chapter, index) => ({
      ...chapter,
      order: index + 1,
    }));
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Chapters</CardTitle>
        <Dialog
          open={isCreateChapterOpen}
          onOpenChange={setIsCreateChapterOpen}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Chapter
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Chapter</DialogTitle>
              <DialogDescription>
                Enter the title for the new chapter.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit((values) =>
                  createChapterMutate(values),
                )}
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Chapter Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter chapter title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter className="mt-4">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setIsCreateChapterOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={
                      form.formState.isSubmitting || form.formState.isValidating
                    }
                  >
                    {form.formState.isSubmitting ? (
                      <Loader2 className="h-6 w-6 animate-spin" />
                    ) : (
                      "Add Chapter"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={(event) => {
            const { active, over } = event;
            if (over && active.id !== over.id) {
              setChapters((items) => {
                const oldIndex = items.findIndex(
                  (item) => item.id === active.id,
                );
                const newIndex = items.findIndex((item) => item.id === over.id);
                const reorderedItems = arrayMove(items, oldIndex, newIndex);
                return reorderChapters(reorderedItems);
              });
            }
          }}
        >
          <SortableContext
            items={chapters}
            strategy={verticalListSortingStrategy}
          >
            {chapters.map((chapter) => (
              <SortableChapterItem
                key={chapter.id}
                courseId={courseId}
                chapter={chapter}
                onEdit={async (id, newTitle) => {
                  setChapters(
                    chapters.map((ch) =>
                      ch.id === id ? { ...ch, title: newTitle } : ch,
                    ),
                  );
                  await updateChapterTitleMutate({
                    chapterId: id,
                    title: newTitle,
                  });
                }}
                onDelete={async (id) => {
                  setChapters(chapters.filter((ch) => ch.id !== id));
                  await deleteChapterAsyncMutate(id);
                }}
              />
            ))}
          </SortableContext>
        </DndContext>
        {hasOrderChanged && (
          <div className="mt-4 flex justify-end">
            <Button onClick={() => handleOrderChange(chapters)}>
              Save Chapter Changes
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

type EditChapterFormValues = z.infer<typeof chapterCreateSchema>;

function SortableChapterItem({
  chapter,
  onEdit,
  onDelete,
  courseId,
}: {
  chapter: Chapter;
  onEdit: (id: string, newTitle: string) => void;
  onDelete: (id: string) => void;
  courseId: string;
}) {
  const [isEditing, setIsEditing] = useState(false);

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: chapter.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const form = useForm<EditChapterFormValues>({
    resolver: zodResolver(chapterCreateSchema),
    defaultValues: {
      title: chapter.title,
    },
  });

  const handleSubmit = (values: EditChapterFormValues) => {
    onEdit(chapter.id, values.title);
    setIsEditing(false);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="mb-2 flex items-center space-x-2 rounded-md border bg-card p-2"
    >
      <div {...attributes} {...listeners}>
        <GripVertical className="h-5 w-5 cursor-move text-muted-foreground" />
      </div>
      {isEditing ? (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-grow items-center space-x-2"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="flex-grow">
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter chapter title"
                      className="flex-grow"
                      autoFocus
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit" size="icon" variant="ghost">
              <Check className="h-4 w-4" />
              <span className="sr-only">Save chapter title</span>
            </Button>
          </form>
        </Form>
      ) : (
        <>
          <span className="flex-grow text-sm">
            <Button variant={"link"} asChild>
              <Link
                href={`/instructor/courses/${courseId}/chapters/${chapter.id}`}
              >
                {chapter.title}
              </Link>
            </Button>
          </span>
          <Badge>{chapter.status}</Badge>

          <Button
            size="icon"
            variant="ghost"
            onClick={() => setIsEditing(true)}
          >
            <Pen className="h-4 w-4" />
            <span className="sr-only">Edit chapter title</span>
          </Button>
        </>
      )}

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost">
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Chapter</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Are you sure you want to delete chapter{" "}
            <span className="font-bold">{chapter.title}</span>? This action
            can&apos;t be undone.
          </DialogDescription>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={() => onDelete(chapter.id)} variant="destructive">
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
