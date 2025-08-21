"use client";

import { PanelLeft } from "lucide-react";

import { CourseSidebar } from "@/app/dashboard/_components/course-sidebar";
import { CourseSidebarDataType } from "@/app/data/course/get-course-sidebar-data";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";

export function CourseLayoutClient({
  children,
  course,
}: {
  children: React.ReactNode;
  course: CourseSidebarDataType["course"];
}) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div>
        <div className="top-0 z-10 sticky flex items-center gap-3 bg-background p-4 border-b">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline">
                <PanelLeft />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="px-4 py-4 w-80">
              <SheetHeader className="p-0">
                <SheetTitle>{course.title}</SheetTitle>
                <SheetDescription>
                  Access course sections and materials from the sidebar.
                </SheetDescription>
              </SheetHeader>
              <CourseSidebar course={course} />
            </SheetContent>
          </Sheet>
          <h1 className="font-semibold text-lg truncate">{course.title}</h1>
        </div>
        <div className="w-full">{children}</div>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-12 h-full">
      <div className="md:col-span-3">
        <div className="border-r h-full">
          <CourseSidebar course={course} />
        </div>
      </div>
      <div className="md:col-span-9">{children}</div>
    </div>
  );
}
