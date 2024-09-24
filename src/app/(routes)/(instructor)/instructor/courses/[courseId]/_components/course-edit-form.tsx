"use client";

import { editCourse } from "@/actions/course.action";
import { ToastMessage } from "@/components/toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
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
import { Check, GripVertical, Pen, Plus, TagIcon, Trash2 } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { courseByIdAction } from "../_action";

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
});

const chaptersSchema = z.array(chapterSchema);

type Chapter = z.infer<typeof chapterSchema>;

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
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
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
                            Drag 'n' drop an image here, or click to select one
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

      <Chapters courseId={courseId} initChapters={courseData?.chapters || []} />
    </div>
  );
}

function Chapters({
  courseId,
  initChapters = [],
}: {
  courseId: string;
  initChapters: {
    id: string;
    title: string;
  }[];
}) {
  console.debug(initChapters);
  const [hasChapterChanges, setHasChapterChanges] = useState(false);
  const [chapters, setChapters] = useState<Chapter[]>(initChapters);
  const [isCreateChapterOpen, setIsCreateChapterOpen] = useState(false);

  // const { mutateAsync: publishCourseMutation } = useMutation({
  //   mutationFn: async () => {
  //     // const res = await publishCourse(courseId);
  //     // 5 seconds wait
  //     await new Promise((resolve) => setTimeout(resolve, 5000));
  //     return {
  //       success: true,
  //       message: "Course published successfully",
  //       error: "",
  //     };
  //   },
  //   onSuccess: (data) => {
  //     queryClient.invalidateQueries({ queryKey: [`course-${courseId}`] });
  //     if (data.success) {
  //       ToastMessage({ message: data.message, type: "success" });
  //     } else {
  //       ToastMessage({ message: data.error || data.message, type: "error" });
  //     }
  //   },
  // });

  const onChaptersSave = async (updatedChapters: Chapter[]) => {
    console.debug(updatedChapters);
    // const formData = new FormData();
    // formData.set("id", courseId);
    // formData.append("chapters", JSON.stringify(updatedChapters));
    // // await courseUpdateMutation(formData);
    // setHasChapterChanges(false);
  };

  const onPublish = async () => {
    // await publishCourseMutation();
  };

  return (
    <>
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
              <Input placeholder="Chapter title" id="chapterTitle" />
              <DialogFooter>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setIsCreateChapterOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    const title = (
                      document.getElementById(
                        "chapterTitle",
                      ) as HTMLInputElement
                    ).value;
                    if (title) {
                      setChapters([
                        ...chapters,
                        { id: Date.now().toString(), title },
                      ]);
                      setHasChapterChanges(true);
                    }
                    setIsCreateChapterOpen(false);
                  }}
                >
                  Add Chapter
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <DndContext
            sensors={useSensors(
              useSensor(PointerSensor),
              useSensor(KeyboardSensor, {
                coordinateGetter: sortableKeyboardCoordinates,
              }),
            )}
            collisionDetection={closestCenter}
            onDragEnd={(event) => {
              const { active, over } = event;
              if (over && active.id !== over.id) {
                setChapters((items) => {
                  const oldIndex = items.findIndex(
                    (item) => item.id === active.id,
                  );
                  const newIndex = items.findIndex(
                    (item) => item.id === over.id,
                  );
                  return arrayMove(items, oldIndex, newIndex);
                });
                setHasChapterChanges(true);
              }
            }}
          >
            <SortableContext
              items={chapters}
              strategy={verticalListSortingStrategy}
            >
              {chapters.map((chapter, index) => (
                <SortableChapterItem
                  key={index}
                  chapter={chapter}
                  onEdit={(id, newTitle) => {
                    setChapters(
                      chapters.map((ch) =>
                        ch.id === id ? { ...ch, title: newTitle } : ch,
                      ),
                    );
                    setHasChapterChanges(true);
                  }}
                  onDelete={(id) => {
                    setChapters(chapters.filter((ch) => ch.id !== id));
                    setHasChapterChanges(true);
                  }}
                />
              ))}
            </SortableContext>
          </DndContext>
          {hasChapterChanges && (
            <div className="mt-4 flex justify-end">
              <Button onClick={() => onChaptersSave(chapters)}>
                Save Chapter Changes
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      {chapters.length > 0 && (
        <Button onClick={onPublish} className="w-full">
          Publish Course
        </Button>
      )}
    </>
  );
}

function SortableChapterItem({
  chapter,
  onEdit,
  onDelete,
}: {
  chapter: Chapter;
  onEdit: (id: string, newTitle: string) => void;
  onDelete: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: chapter.id });
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(chapter.title);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleSaveEdit = () => {
    onEdit(chapter.id, editedTitle);
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
        <Input
          value={editedTitle}
          onChange={(e) => setEditedTitle(e.target.value)}
          onBlur={handleSaveEdit}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSaveEdit();
            }
          }}
          className="flex-grow"
          autoFocus
        />
      ) : (
        <span className="flex-grow">{chapter.title}</span>
      )}
      {isEditing ? (
        <Button size="icon" variant="ghost" onClick={handleSaveEdit}>
          <Check className="h-4 w-4" />
        </Button>
      ) : (
        <Button size="icon" variant="ghost" onClick={() => setIsEditing(true)}>
          <Pen className="h-4 w-4" />
        </Button>
      )}
      <Button size="icon" variant="ghost" onClick={() => onDelete(chapter.id)}>
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
