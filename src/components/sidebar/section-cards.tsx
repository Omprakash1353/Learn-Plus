import {
  IconBook,
  IconPlaylistX,
  IconShoppingCart,
  IconUsers,
} from "@tabler/icons-react";

import { adminGetDashboardStats } from "@/app/data/admin/admin-get-dashboard-stats";
import { instructorGetDashboardStats } from "@/app/data/instructor/instructor-get-dashboard-stats";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export async function SectionCards({role}:{role: "admin" | "instructor"}) {
  let status:{
    totalSignUps?: number;
    totalCourses: number;
    totalCustomers: number;
    totalLessons: number;
  } = {
    totalSignUps: 0,
    totalCourses: 0,
    totalCustomers: 0,
    totalLessons: 0,
  }

  if(role === "instructor")
    status = await instructorGetDashboardStats();
  else if(role === "admin")
    status = await adminGetDashboardStats();

  return (
    <div className={cn(role === "admin" ? "gap-4 grid grid-cols-1 @5xl/main:grid-cols-4 @xl/main:grid-cols-2" : "gap-4 grid grid-cols-3 @5xl/main:grid-cols-3 @xl/main:grid-cols-2","dark:*:data-[slot=card]:bg-card *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs")}>
     {role !== "instructor" && status && status?.totalSignUps && <Card className="@container/card">
        <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
          <div>
            <CardDescription>Total SignUps</CardDescription>
            <CardTitle className="font-semibold tabular-nums text-2xl @[250px]/card:text-3xl">
              {status?.totalSignUps}
            </CardTitle>
          </div>
          <IconUsers className="size-6 text-muted-foreground" />
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <p className="text-muted-foreground">
            Registered users on the platform
          </p>
        </CardFooter>
      </Card>}
      <Card className="@container/card">
        <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
          <div>
            <CardDescription>Total Customers</CardDescription>
            <CardTitle className="font-semibold tabular-nums text-2xl @[250px]/card:text-3xl">
              {status?.totalCustomers}
            </CardTitle>
          </div>
          <IconShoppingCart className="size-6 text-muted-foreground" />
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <p className="text-muted-foreground">
            Users who have enrolled in courses
          </p>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
          <div>
            <CardDescription>Total Courses</CardDescription>
            <CardTitle className="font-semibold tabular-nums text-2xl @[250px]/card:text-3xl">
              {status?.totalCourses}
            </CardTitle>
          </div>
          <IconBook className="size-6 text-muted-foreground" />
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <p className="text-muted-foreground">
            Available courses on the platform
          </p>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
          <div>
            <CardDescription>Total Lessons</CardDescription>
            <CardTitle className="font-semibold tabular-nums text-2xl @[250px]/card:text-3xl">
              {status?.totalLessons}
            </CardTitle>
          </div>
          <IconPlaylistX className="size-6 text-muted-foreground" />
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <p className="text-muted-foreground">
            Total learning content available
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
