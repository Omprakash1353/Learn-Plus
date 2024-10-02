import { StarRating } from "@/components/custom/start-rating";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { db } from "@/lib/db";
import { chapterTable, courseTable } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import parse from "html-react-parser";
import { PlayCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Enrollment } from "./_components/enroll";

export default async function CourseDetailPage({
  params,
}: {
  params: { courseId: string };
}) {
  const course = await db.query.courseTable.findFirst({
    where: eq(courseTable.id, params.courseId),
    with: {
      enrollments: true,
      instructor: {
        with: {
          user: true,
        },
      },
      chapters: {
        where: eq(chapterTable.status, "PUBLISHED"),
      },
    },
  });

  if (!course) return <div className="py-10 text-center">Course Not Found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <section className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">
              {course.title}
            </h1>
            {course?.rating !== null && course.rating > 0 && (
              <div className="flex items-center space-x-4">
                <StarRating
                  readonly
                  rating={course.rating}
                  className="h-5 w-5"
                />
                <span className="text-sm font-medium">
                  {course.rating.toFixed(1)} ({course.enrollments.length}{" "}
                  reviews)
                </span>
                {course.enrollments.length > 100 && (
                  <Badge variant="secondary">Bestseller</Badge>
                )}
              </div>
            )}
          </section>

          {/* <Card className="bg-muted/50">
            <CardContent className="p-6">
              <div className="grid gap-4 sm:grid-cols-3">
                {course.enrollments.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <span>{course.enrollments.length} students</span>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-emerald-600" />
                  <span>50 hours of content</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  <span>Certificate of completion</span>
                </div>
              </div>
            </CardContent>
          </Card> */}

          <Card>
            <CardHeader>
              <CardTitle>Course Overview</CardTitle>
            </CardHeader>
            {course?.description && (
              <CardContent className="prose max-w-none">
                {parse(course?.description)}
              </CardContent>
            )}
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Meet Your Instructor</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={course.instructor?.user.profilePictureUrl || ""}
                  />
                  <AvatarFallback>
                    {course.instructor?.user.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">
                    {course.instructor?.user.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {course?.instructor?.user?.expertize}
                  </p>
                  <p className="mt-2 text-sm">{course.instructor?.user.bio}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="sticky top-6">
            <CardContent className="p-6">
              <div className="mb-6 aspect-video overflow-hidden rounded-lg">
                {course?.thumbnailUrl ? (
                  <Image
                    src={course.thumbnailUrl}
                    alt="Course Image"
                    width={500}
                    height={280}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Image
                    src="/placeholder.svg"
                    alt={course.title}
                    height={280}
                    width={500}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              <div className="mb-4 flex items-baseline justify-between">
                <span className="text-3xl font-bold">
                  ${course?.price?.toFixed(2)}
                </span>
                {course?.discount !== null &&
                  course?.discount > 0 &&
                  course?.price !== null && (
                    <div className="text-right">
                      <span className="text-sm text-muted-foreground line-through">
                        $
                        {(course?.price * (1 + course.discount / 100)).toFixed(
                          2,
                        )}
                      </span>
                      <Badge variant="destructive" className="ml-2">
                        {course?.discount}% OFF
                      </Badge>
                    </div>
                  )}
              </div>
              <Enrollment courseId={params.courseId} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Course Content</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[400px]">
                {course.chapters?.map((chapter, index) => (
                  <div
                    key={chapter.id}
                    className="p-4 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <PlayCircle className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          {index + 1}. {chapter.title}
                        </span>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/courses/${course.id}/${chapter.id}`}>
                          Preview
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
