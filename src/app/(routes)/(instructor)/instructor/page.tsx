"use client";

import { Bell, BookOpen, DollarSign, Star, Users } from "lucide-react";
import { useState } from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

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
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";

const data = [
  {
    name: "Jan",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Feb",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Mar",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Apr",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "May",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Jun",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Jul",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Aug",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Sep",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Oct",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Nov",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Dec",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
];

export default function InstructorDashboard() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Button asChild>
            <Link href={"/instructor/courses/create"}>Add Courses</Link>
          </Button>
          <Button>Download Report</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Students
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+2350</div>
            <p className="text-xs text-muted-foreground">
              +180.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+3 new this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Notifications</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+12 since yesterday</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={data}>
                <XAxis
                  dataKey="name"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `$${value}`}
                />
                <Bar dataKey="total" fill="#adfa1d" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Students</CardTitle>
            <CardDescription>
              You have {studentData.length} new students this month.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[350px]">
              <div className="space-y-8">
                {studentData.map((student) => (
                  <div className="flex items-center" key={student.email}>
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={student.avatar} alt="Avatar" />
                      <AvatarFallback>{student.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {student.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {student.email}
                      </p>
                    </div>
                    <div className="ml-auto font-medium">{student.course}</div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Recent Course Activity</CardTitle>
          <CardDescription>
            Monitor your course activity and student engagement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Search activities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Activity</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activityData
                .filter(
                  (activity) =>
                    activity.course
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase()) ||
                    activity.student
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase()) ||
                    activity.activity
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase()),
                )
                .map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell className="font-medium">
                      {activity.course}
                    </TableCell>
                    <TableCell>{activity.student}</TableCell>
                    <TableCell>{activity.activity}</TableCell>
                    <TableCell>{activity.date}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

const studentData = [
  {
    name: "Olivia Martin",
    email: "olivia.martin@email.com",
    avatar: "/placeholder.svg?height=32&width=32",
    course: "React Fundamentals",
  },
  {
    name: "Jackson Lee",
    email: "jackson.lee@email.com",
    avatar: "/placeholder.svg?height=32&width=32",
    course: "Advanced JavaScript",
  },
  {
    name: "Isabella Nguyen",
    email: "isabella.nguyen@email.com",
    avatar: "/placeholder.svg?height=32&width=32",
    course: "UI/UX Design",
  },
  {
    name: "William Kim",
    email: "william.kim@email.com",
    avatar: "/placeholder.svg?height=32&width=32",
    course: "Python for Beginners",
  },
  {
    name: "William Kim",
    email: "william.kim@email.com",
    avatar: "/placeholder.svg?height=32&width=32",
    course: "Python for Beginners",
  },
];

const activityData = [
  {
    id: 1,
    course: "React Fundamentals",
    student: "Olivia Martin",
    activity: "Completed Module 3",
    date: "2023-04-23",
  },
  {
    id: 2,
    course: "Advanced JavaScript",
    student: "Jackson Lee",
    activity: "Submitted Project",
    date: "2023-04-22",
  },
  {
    id: 3,
    course: "UI/UX Design",
    student: "Isabella Nguyen",
    activity: "Started Course",
    date: "2023-04-21",
  },
  {
    id: 4,
    course: "Python for Beginners",
    student: "William Kim",
    activity: "Completed Quiz",
    date: "2023-04-20",
  },
  {
    id: 5,
    course: "React Fundamentals",
    student: "Sophia Chen",
    activity: "Watched Lecture 5",
    date: "2023-04-19",
  },
];
