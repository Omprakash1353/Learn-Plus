import { StarRating } from "@/components/custom/start-rating";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { db } from "@/lib/db";
import { courseTable } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { BookOpen, Clock, Users } from "lucide-react";
import Image from "next/image";
import parse from "html-react-parser";

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
    },
  });

  console.log(course);

  if (!course) return <div>Course Not Found</div>;

  return (
    <div className="mx-auto max-w-full p-4 md:p-6">
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-6">
            <h1 className="mb-2 text-3xl font-bold tracking-tight">
              {course.title}
            </h1>
            <p className="text-lg text-muted-foreground">
              Master the essential skills for modern web development
            </p>
          </div>

          {course?.rating !== null && course.rating > 0 && (
            <div className="mb-6 flex items-center space-x-4">
              <StarRating readonly rating={course.rating} className="h-5 w-5" />
              <span className="text-sm font-medium">
                {course.rating} ({course.enrollments.length} reviews)
              </span>
              <Badge variant="secondary">Bestseller</Badge>
            </div>
          )}

          <Card className="mb-8 border-none shadow-none outline-none">
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
          </Card>

          <div className="flex flex-col gap-5">
            <Card className="border-none shadow-none outline-none">
              <CardHeader>
                <CardTitle>Course Overview</CardTitle>
              </CardHeader>
              {course?.description && (
                <CardContent className="text-sm">
                  <div>{parse(course?.description)}</div>
                </CardContent>
              )}
            </Card>

            <Card className="border-none shadow-none outline-none">
              <CardHeader>
                <CardTitle>Meet Your Instructor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={course.instructor?.user.profilePictureUrl || ""}
                    />
                    <AvatarFallback>
                      {course.instructor?.user.name
                        .substring(0, 2)
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold">
                      {course.instructor?.user.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {course?.instructor?.user?.expertize}
                    </p>
                    <p className="mt-2 text-sm">
                      {course.instructor?.user.bio}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-none outline-none">
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible>
                  <AccordionItem value="item-1">
                    <AccordionTrigger>
                      What are the prerequisites for this course?
                    </AccordionTrigger>
                    <AccordionContent>
                      Basic understanding of HTML, CSS, and JavaScript is
                      recommended. However, we&apos;ll review the fundamentals
                      at the beginning of the course to ensure everyone is on
                      the same page.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>
                      How long do I have access to the course material?
                    </AccordionTrigger>
                    <AccordionContent>
                      You have lifetime access to all course materials,
                      including future updates and improvements.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger>
                      Is there a money-back guarantee?
                    </AccordionTrigger>
                    <AccordionContent>
                      Yes, we offer a 30-day money-back guarantee. If
                      you&apos;re not satisfied with the course, you can request
                      a full refund within 30 days of purchase, no questions
                      asked.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <Card className="sticky top-6 border-none shadow-none outline-none">
            <CardContent className="p-6">
              <div className="aspect-video overflow-hidden rounded-lg">
                {course?.thumbnailUrl ? (
                  <Image
                    src={course?.thumbnailUrl || ""}
                    alt="Course Image"
                    width={500}
                    height={280}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Image
                    src={"/placeholder.svg"}
                    alt={course.title}
                    height={280}
                    width={500}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              {/* {isEnrolled ? (
                <Button className="mt-6 w-full" asChild>
                  <Link href={`/courses/${course.id}/chapter-1`}>
                    <PlayCircle className="mr-2 h-4 w-4" />
                    Continue Learning
                  </Link>
                </Button>
              ) : (
                <div className="mt-6">
                  <div className="mb-4 flex items-baseline justify-between">
                    <span className="text-3xl font-bold">
                      ${price.toFixed(2)}
                    </span>
                    <div className="text-right">
                      <span className="text-sm text-muted-foreground line-through">
                        ${originalPrice.toFixed(2)}
                      </span>
                      <Badge variant="destructive" className="ml-2">
                        {discount}% OFF
                      </Badge>
                    </div>
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => setIsEnrolled(true)}
                  >
                    Enroll Now
                  </Button>
                </div>
              )} */}
            </CardContent>
          </Card>

          <ScrollArea className="max-h-[400px]">
            {/* <CourseOverview data={courseContent} header="Chapters" /> */}
          </ScrollArea>
        </div>
      </div>

      <div className="mt-5 p-5">
        <h1 className="pb-5 text-lg">See What Others Are Saying</h1>
        <ScrollArea className="h-[350px]">
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex space-x-4 rounded-lg p-2">
                <Avatar>
                  <AvatarFallback>{`U${i + 1}`}</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="text-base font-semibold">User {i + 1}</h4>
                  <StarRating readonly rating={5} className="my-1 h-4 w-4" />
                  <p className="text-sm text-muted-foreground">
                    This course exceeded my expectations. The content is
                    well-structured and the instructor explains everything
                    clearly. I feel much more confident in my web development
                    skills now.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
