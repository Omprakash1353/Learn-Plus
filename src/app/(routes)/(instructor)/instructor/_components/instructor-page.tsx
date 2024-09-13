"use client";

import { Bell, BookOpen, DollarSign, Users } from "lucide-react";
import { useState } from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { useCountUp } from "@/hooks/useCountUp";

type monthlyRevenue = {
  name: string;
  total: number;
}[];

type studentData = {
  name: string;
  email: string;
  avatar: string;
  course: string;
}[];

type activityData = {
  id: string | number;
  course: string;
  student: string;
  activity: string;
  date: string | Date;
}[];

type InstructorClientPage = {
  monthlyRevenue: monthlyRevenue;
  studentData: studentData;
  activityData: activityData;
};

export function InstructorClientPage(props: InstructorClientPage) {
  const totalRevenue = useCountUp(45231.89);
  const activeStudent = useCountUp(2350);
  const courses = useCountUp(12);
  const notifications = useCountUp(24);

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue}</div>
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
            <div className="text-2xl font-bold">+{activeStudent}</div>
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
            <div className="text-2xl font-bold">{courses}</div>
            <p className="text-xs text-muted-foreground">+3 new this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Notifications</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notifications}</div>
            <p className="text-xs text-muted-foreground">+12 since yesterday</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <MonthlyRevenueOverviewGraph monthlyRevenue={props.monthlyRevenue} />
        <StudentDataTable studentData={props.studentData} />
      </div>

      <RecentCourseActivityTable activityData={props.activityData} />
    </>
  );
}

export function StudentDataTable({
  studentData,
}: {
  studentData: studentData;
}) {
  return (
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
  );
}

export function MonthlyRevenueOverviewGraph({
  monthlyRevenue,
}: {
  monthlyRevenue: monthlyRevenue;
}) {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Overview</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={monthlyRevenue}>
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
  );
}

export function RecentCourseActivityTable({
  activityData,
}: {
  activityData: activityData;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  return (
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
                  <TableCell>{activity.date.toLocaleString()}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
