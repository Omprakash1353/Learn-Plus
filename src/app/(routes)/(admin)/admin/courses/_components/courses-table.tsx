"use client";

import { useQuery } from "@tanstack/react-query";
import { Loader2, Search, Star } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { getAdminCourses } from "../_action";

export function AdminCourseTable() {
  const [searchCourse, setSearchCourse] = useState("");

  const {
    data: coursesData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["courses-admin"],
    queryFn: async () => {
      const res = await getAdminCourses();
      return res.data;
    },
  });

  const filteredCourses =
    coursesData?.filter((course) =>
      course.title.toLowerCase().includes(searchCourse.toLowerCase()),
    ) || [];

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error as Error} />;

  return (
    <Card className="col-span-5 border-none shadow-none outline-none">
      <CardHeader>
        <CardTitle>Courses</CardTitle>
        <CardDescription>Manage and monitor course catalog</CardDescription>
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
              <TableHead>Course Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Students Enrolled</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Overall Rating</TableHead>
              <TableHead>Instructor</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Updated At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCourses.map((course) => (
              <TableRow key={course.id}>
                <TableCell className="font-medium">
                  <Button variant="link" className="h-0" asChild>
                    <Link href={`/courses/${course.id}`}>{course.title}</Link>
                  </Button>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      course.status === "PUBLISHED" ? "default" : "secondary"
                    }
                  >
                    {course.status}
                  </Badge>
                </TableCell>
                <TableCell>{course.enrollments}</TableCell>
                <TableCell>
                  {course.price === 0 || course.price === null
                    ? "Free"
                    : `$${course.price.toFixed(2)}`}
                </TableCell>
                <TableCell>
                  {course.rating !== null && course.rating > 0 ? (
                    <div className="flex items-center">
                      <Star className="mr-1 h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{course.rating.toFixed(1)}</span>
                    </div>
                  ) : (
                    "N/A"
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={course.instructor.profilePictureUrl || ""}
                        alt={course.instructor.name}
                      />
                      <AvatarFallback>
                        {course.instructor.name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span>{course.instructor.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {new Date(course.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {new Date(course.updatedAt).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function LoadingState() {
  return (
    <Card className="col-span-5 border-none shadow-none outline-none">
      <CardHeader>
        <CardTitle>Courses</CardTitle>
        <CardDescription>Manage and monitor course catalog</CardDescription>
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
              <TableHead>Instructor</TableHead>
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
                  <div className="flex items-center space-x-2">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-4 w-[100px]" />
                  </div>
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
          <Loader2 className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      </CardContent>
    </Card>
  );
}
