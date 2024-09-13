import Link from "next/link";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { validateRequest } from "@/lib/lucia";
import { InstructorClientPage } from "./_components/instructor-page";

export default async function InstructorDashboard() {
  const { user, session } = await validateRequest();

  if (!user || !session || user.role !== "INSTRUCTOR") {
    return redirect("/");
  }

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
      <InstructorClientPage
        monthlyRevenue={monthlyRevenue}
        studentData={studentData}
        activityData={activityData}
      />
    </div>
  );
}

const monthlyRevenue = [
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
