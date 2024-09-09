"use client";

import { Star } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export function CoursesTable() {
  const [searchCourse, setSearchCourse] = useState("");

  const filteredCourses = courseData.filter((course) =>
    course.name.toLowerCase().includes(searchCourse.toLowerCase()),
  );

  return (
    <>
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
          {filteredCourses.map((course) => (
            <TableRow key={course.id}>
              <TableCell className="font-medium">
                <Button variant="link" className="h-0">{course.name}</Button>
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
              <TableCell>{course.students}</TableCell>
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
    </>
  );
}

const courseData = [
  {
    id: 1,
    name: "Introduction to React",
    status: "Published",
    students: 150,
    price: 49.99,
    rating: 4.5,
  },
  {
    id: 2,
    name: "Advanced JavaScript",
    status: "Draft",
    students: 0,
    price: 79.99,
    rating: 0,
  },
  {
    id: 3,
    name: "Web Design Fundamentals",
    status: "Published",
    students: 75,
    price: 0,
    rating: 4.2,
  },
  {
    id: 4,
    name: "Python for Beginners",
    status: "Published",
    students: 200,
    price: 39.99,
    rating: 4.8,
  },
  {
    id: 5,
    name: "Data Science Essentials",
    status: "Draft",
    students: 0,
    price: 89.99,
    rating: 0,
  },
];
