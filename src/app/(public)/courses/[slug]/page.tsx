import {
  IconBook,
  IconCategory,
  IconChartBar,
  IconChevronDown,
  IconClock,
  IconPlayerPlay,
} from "@tabler/icons-react";
import { CheckIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { getIndividualCourse } from "@/app/data/course/get-course";
import { checkIfCourseBought } from "@/app/data/user/user-is-enrolled";
import { RenderDescription } from "@/components/rich-text-editor/render-description";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { useConstructUrl } from "@/hooks/use-construct-url";
import { EnrollmentButton } from "./_components/enrollment-button";
import { enrollInCourse } from "./actions";

function CourseThumbnail({
  fileKey,
  alt = "",
}: {
  fileKey: string;
  alt?: string;
}) {
  const thumbnailUrl = useConstructUrl(fileKey);

  return (
    <Image
      src={thumbnailUrl}
      alt={alt}
      fill
      className="object-cover"
      priority
    />
  );
}

export default async function SlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = await getIndividualCourse(slug);
  const isEnrolled = await checkIfCourseBought(course.id);

  return (
    <div className="gap-8 grid grid-cols-1 lg:grid-cols-3">
      <div className="order-1 lg:col-span-2">
        <div className="relative shadow-lg rounded-xl w-full aspect-video overflow-hidden">
          <CourseThumbnail fileKey={course.fileKey} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>
        <div className="space-y-6 mt-8">
          <div className="space-y-4">
            <h1 className="font-bold text-4xl tracking-tight">
              {course.title}
            </h1>
            <p className="text-muted-foreground text-lg line-clamp-2 leading-relaxed">
              {course.smallDescription}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Badge className="flex items-center gap-1 px-3 py-1">
              <IconChartBar className="size-4" />
              <span>{course.level}</span>
            </Badge>
            <Badge className="flex items-center gap-1 px-3 py-1">
              <IconCategory className="size-4" />
              <span>{course.category}</span>
            </Badge>
            <Badge className="flex items-center gap-1 px-3 py-1">
              <IconClock className="size-4" />
              <span>{course.duration} hours</span>
            </Badge>
          </div>

          <Separator className="my-8" />

          <div className="space-y-6">
            <h2 className="font-semibold text-3xl tracking-tight">
              Course Description
            </h2>

            <div>
              <RenderDescription json={JSON.parse(course.description)} />
            </div>
          </div>

          <div className="space-y-6 mt-12">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-3xl tracking-tight">
                Course Content
              </h2>
              <div>
                {course.chapters.length} chapters |{" "}
                {course.chapters.reduce(
                  (total, chapter) => total + chapter.lessons.length,
                  0
                ) || 0}{" "}
                Lessons
              </div>
            </div>

            <div className="space-y-4">
              {course.chapters.map((chapter, index) => (
                <Collapsible key={index} defaultOpen={index === 0}>
                  <Card className="gap-0 hover:shadow-md p-0 border-2 overflow-hidden transition-all duration-200">
                    <CollapsibleTrigger>
                      <div>
                        <CardContent className="hover:bg-muted/50 p-6 transition-colors">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-4">
                              <p className="flex justify-center items-center bg-primary/10 rounded-full size-10 font-semibold">
                                {index + 1}
                              </p>
                              <div>
                                <h3 className="font-semibold text-xl text-left">
                                  {chapter.title}
                                </h3>
                                <p className="mt-1 text-muted-foreground text-sm text-left">
                                  {chapter.lessons.length} lesson
                                  {chapter.lessons.length !== 1 ? "s" : ""}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <Badge variant="outline" className="text-xs">
                                {chapter.lessons.length} lesson
                                {chapter.lessons.length !== 1 ? "s" : ""}
                              </Badge>

                              <IconChevronDown className="size-5 text-muted-foreground" />
                            </div>
                          </div>
                        </CardContent>
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="bg-muted/20 border-t">
                        <div className="space-y-3 p-6 pt-4">
                          {chapter.lessons.map((lesson, index) => (
                            <div
                              key={lesson.id}
                              className="flex items-center gap-4 hover:bg-accent p-3 rounded-lg transition-colors"
                            >
                              <div className="flex justify-center items-center bg-background border-2 border-primary/20 rounded-full size-8">
                                <IconPlayerPlay className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
                              </div>

                              <div className="flex-1">
                                <p className="font-medium text-sm">
                                  {lesson.title}
                                </p>
                                <p className="mt-1 text-muted-foreground text-xs">
                                  Lesson {index + 1}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Enrollment Card */}
      <div className="order-2 lg:col-span1">
        <div className="top-20 sticky">
          <Card className="py-0">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <span className="font-medium text-lg">Price:</span>
                <span className="font-bold text-primary text-2xl">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(course.price)}
                </span>
              </div>

              <div className="space-y-3 bg-muted mb-6 p-4 rounded-lg">
                <h4 className="font-medium">What you wil get:</h4>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex justify-center items-center bg-primary/10 rounded-full size-8">
                      <IconClock className="size-4" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Course Duration</p>
                      <p className="text-muted-foreground text-sm">
                        {course.duration}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex justify-center items-center bg-primary/10 rounded-full size-8">
                      <IconChartBar className="size-4" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Difficulty Level</p>
                      <p className="text-muted-foreground text-sm">
                        {course.level}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex justify-center items-center bg-primary/10 rounded-full size-8">
                      <IconCategory className="size-4" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Category</p>
                      <p className="text-muted-foreground text-sm">
                        {course.category}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex justify-center items-center bg-primary/10 rounded-full size-8">
                      <IconBook className="size-4" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Total Lessons</p>
                      <p className="text-muted-foreground text-sm">
                        {course.chapters.reduce(
                          (total, chapter) => total + chapter.lessons.length,
                          0
                        ) || 0}{" "}
                        Lessons
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <h4>This course includes:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm">
                      <div className="bg-emerald-500/10 p-1 rounded-full text-emerald-500">
                        <CheckIcon className="size-3" />
                      </div>
                      <span>Full lifetime access</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <div className="bg-emerald-500/10 p-1 rounded-full text-emerald-500">
                        <CheckIcon className="size-3" />
                      </div>
                      <span>Access on mobile and desktop</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <div className="bg-emerald-500/10 p-1 rounded-full text-emerald-500">
                        <CheckIcon className="size-3" />
                      </div>
                      <span>Certificate of completion</span>
                    </li>
                  </ul>
                </div>
              </div>
              <form
                action={async () => {
                  "use server";
                  enrollInCourse(course.id);
                }}
              >
                {isEnrolled ? (
                  <Link
                    className={buttonVariants({ className: "w-full" })}
                    href="/dashboard"
                  >
                    Watch Course
                  </Link>
                ) : (
                  <EnrollmentButton courseId={course.id} />
                )}
              </form>
              <p className="mt-3 text-muted-foreground text-xs text-center">
                30-day money-back guarantee
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
