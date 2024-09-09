"use client";

import { StarRating } from "@/components/custom/start-rating";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { courseContent } from "@/constants/course-topics";
import { BookOpen, Clock, PlayCircle, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import CourseOverview from "./_components/course-overview";

export default function CourseDetailsPage({
  params,
}: {
  params: { courseId: string };
}) {
  const [isEnrolled, setIsEnrolled] = useState(false);
  const courseRating = 4.9;
  const reviewCount = 200;
  const price = 72.06;
  const originalPrice = 90.08;
  const discount = 20;

  return (
    <div className="mx-auto max-w-full p-4 md:p-6">
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-6">
            <h1 className="mb-2 text-3xl font-bold tracking-tight">
              Modern Web Development Masterclass
            </h1>
            <p className="text-lg text-muted-foreground">
              Master the essential skills for modern web development
            </p>
          </div>

          <div className="mb-6 flex items-center space-x-4">
            <StarRating readonly rating={courseRating} className="h-5 w-5" />
            <span className="text-sm font-medium">
              {courseRating} ({reviewCount} reviews)
            </span>
            <Badge variant="secondary">Bestseller</Badge>
          </div>

          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <span>10,000+ students</span>
                </div>
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
              <CardContent className="text-sm">
                <p className="mb-4">
                  This comprehensive course provides a deep dive into modern web
                  development techniques and technologies. From front-end
                  frameworks to back-end APIs, you&apos;ll gain hands-on experience
                  through interactive projects and real-world examples.
                </p>
                <h3 className="mb-2 text-lg font-semibold">
                  What you&apos;ll learn:
                </h3>
                <ul className="list-inside list-disc space-y-1">
                  <li>Master HTML5, CSS3, and JavaScript</li>
                  <li>Build responsive and interactive user interfaces</li>
                  <li>Work with popular frameworks like React and Vue.js</li>
                  <li>Develop RESTful APIs using Node.js and Express</li>
                  <li>Implement authentication and authorization</li>
                  <li>Deploy your applications to the cloud</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-none shadow-none outline-none">
              <CardHeader>
                <CardTitle>Meet Your Instructor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold">Jane Doe</h3>
                    <p className="text-sm text-muted-foreground">
                      Senior Web Developer & Educator
                    </p>
                    <p className="mt-2 text-sm">
                      Jane is a passionate web developer with over 10 years of
                      industry experience. She has a talent for breaking down
                      complex concepts into easy-to-understand lessons, making
                      her courses accessible to beginners and valuable for
                      experienced developers alike.
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
                      recommended. However, we&apos;ll review the fundamentals at the
                      beginning of the course to ensure everyone is on the same
                      page.
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
                      Yes, we offer a 30-day money-back guarantee. If you&apos;re not
                      satisfied with the course, you can request a full refund
                      within 30 days of purchase, no questions asked.
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
                <Image
                  src="https://images.unsplash.com/photo-1724757090342-59922ed19e39?q=80&w=2100&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Course Image"
                  width={500}
                  height={280}
                  className="h-full w-full object-cover"
                />
              </div>
              {isEnrolled ? (
                <Button className="mt-6 w-full" asChild>
                  <Link href={`/courses/${params.courseId}/chapter-1`}>
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
              )}
            </CardContent>
          </Card>

          <ScrollArea className="max-h-[400px]">
            <CourseOverview data={courseContent} header="Chapters" />
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
                  <h4 className="font-semibold text-base">User {i + 1}</h4>
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
