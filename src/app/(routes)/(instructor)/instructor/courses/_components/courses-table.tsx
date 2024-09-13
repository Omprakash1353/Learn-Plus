"use client";

import { Star } from "lucide-react";
import { useState } from "react";

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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";

export type coursesDataType = {
  id: string;
  title: string;
  status: string;
  students: number;
  price: number;
  rating: number;
  enrollments: { id: string }[];
};

type CoursesTableProps = {
  coursesData: coursesDataType[];
};

export function CoursesTable({ coursesData }: CoursesTableProps) {
  const [searchCourse, setSearchCourse] = useState("");

  const filteredCourses = coursesData.filter((crs: { title: string }) =>
    crs.title.toLowerCase().includes(searchCourse.toLowerCase()),
  );

  return (
    <Card className="col-span-5">
      <CardHeader>
        <CardTitle>Your Courses</CardTitle>
        <CardDescription>
          Manage and monitor your course catalog
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Input
            placeholder="Search courses..."
            value={searchCourse}
            onChange={(e) => setSearchCourse(e.target.value)}
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
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCourses.map((course: coursesDataType) => (
              <TableRow key={course.id}>
                <TableCell className="font-medium">
                  <Button variant="link" className="h-0" asChild>
                    <Link href={`/instructor/courses/${course.id}`}>{course.title}</Link>
                  </Button>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      course.status === "Published" ? "default" : "secondary"
                    }
                  >
                    {course.status}
                  </Badge>
                </TableCell>
                <TableCell>{course.enrollments.length}</TableCell>
                <TableCell>
                  {course.price === 0 ? "Free" : `$${course.price.toFixed(2)}`}
                </TableCell>
                <TableCell>
                  {course.rating > 0 ? (
                    <div className="flex items-center">
                      <Star className="mr-1 h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{course.rating.toFixed(1)}</span>
                    </div>
                  ) : (
                    "N/A"
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
