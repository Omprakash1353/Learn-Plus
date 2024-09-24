"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, Loader2, Search, Star } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { createCourse } from "@/actions/course.action";
import { ToastMessage } from "@/components/toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getProblems } from "../_action";

const courseCreateSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
});

export function ProblemTable() {
  const [searchCourse, setSearchCourse] = useState("");

  const {
    data: problemData,
    isLoading,
    error,
  } = useQuery({
    queryKey: [`problems`],
    queryFn: async () => {
      const res = await getProblems();
      return res.data;
    },
  });

  const filteredProblems =
    problemData?.filter((course) =>
      course.email.toLowerCase().includes(searchCourse.toLowerCase()),
    ) || [];

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  return (
    <Card className="col-span-5 border-none shadow-none outline-none">
      <CardHeader>
        <div className="flex items-center justify-between space-x-4">
          <div>
            <CardTitle className="mb-1">Your Courses</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Manage and monitor your course catalog
            </CardDescription>
          </div>
          <CourseCreate />
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400" />
          <Input
            placeholder="Search courses..."
            value={searchCourse}
            onChange={(e) => setSearchCourse(e.target.value)}
            className="pl-10"
          />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Problem Question</TableHead>
              <TableHead>Solved</TableHead>
              <TableHead>Resolved At</TableHead>
              <TableHead>Created At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProblems.map((problem) => (
              <TableRow key={problem.id}>
                <TableCell className="font-medium">
                  <Button variant="link" className="h-0" asChild>
                    <Link href={`/instructor/problem/${problem.id}`}>
                      {problem.email}
                    </Link>
                  </Button>
                </TableCell>
                <TableCell>{problem.problemQuestion}</TableCell>
                <TableCell>
                  <Badge
                    variant={problem.solved === true ? "default" : "secondary"}
                  >
                    {problem.solved}
                  </Badge>
                </TableCell>
                <TableCell>
                  {problem?.createdAt
                    ? new Date(problem?.createdAt)?.toLocaleDateString()
                    : ""}
                </TableCell>
                <TableCell>
                  {problem?.resolvedAt
                    ? new Date(problem?.resolvedAt)?.toLocaleDateString()
                    : ""}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function CourseCreate() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof courseCreateSchema>>({
    resolver: zodResolver(courseCreateSchema),
    defaultValues: {
      title: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof courseCreateSchema>) => {
    try {
      const res = await createCourse(values);
      if (res.success) {
        router.push(`/instructor/courses/${res.data?.courseId}`);
        ToastMessage({ message: res.message, type: "success" });
        setOpen(false);
      } else {
        ToastMessage({ message: res?.error || res.message, type: "error" });
        form.setFocus("title");
      }
    } catch (error) {
      ToastMessage({ message: "An unexpected error occurred", type: "error" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <BookOpen className="mr-2 h-4 w-4" />
          Add Course
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Create a New Course
          </DialogTitle>
          <DialogDescription>
            Give your course a name. Don&apos;t worry, you can always change it
            later.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Title</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g., 'Introduction to Web Development'"
                      {...field}
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="flex items-center justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={!isValid || isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Course"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function LoadingState() {
  return (
    <Card className="col-span-5 border-none shadow-none outline-none">
      <CardHeader>
        <div className="flex items-center justify-between space-x-4">
          <div>
            <CardTitle className="mb-1">Your Courses</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Manage and monitor your course catalog
            </CardDescription>
          </div>
          <Skeleton className="h-10 w-[120px]" />
        </div>
      </CardHeader>
      <CardContent>
        <Skeleton className="mb-4 h-10 w-full" />
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Course Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Students Enrolled</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Overall Rating</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Updated At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton className="h-4 w-[200px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-[80px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-[40px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-[60px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-[80px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-[100px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-[100px]" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function ErrorState({ error }: { error: Error }) {
  return (
    <Card className="col-span-5 border-none shadow-none outline-none">
      <CardHeader>
        <CardTitle className="text-red-500">Error Loading Courses</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{error.message}</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Try Again
        </Button>
      </CardContent>
    </Card>
  );
}
