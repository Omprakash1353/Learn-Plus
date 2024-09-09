"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  BookOpen,
  CheckCircle,
  ChevronDown,
  Clock,
  Download,
  MessageSquare,
  PlayCircle,
  ThumbsUp,
} from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";

const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

export default function EnhancedChapterView({
  params,
}: {
  params: { chapterId: string; courseId: string };
}) {
  const [progress, setProgress] = useState(65);
  const [noteContent, setNoteContent] = useState("");
  const [expandedChapter, setExpandedChapter] = useState<number | null>(null);
  const [doubt, setDoubt] = useState("");

  const courseChapters = [
    { id: 1, title: "Introduction to JavaScript", duration: "10 min" },
    { id: 2, title: "Variables and Data Types", duration: "15 min" },
    { id: 3, title: "Functions and Scope", duration: "20 min" },
    { id: 4, title: "Arrays and Objects", duration: "25 min" },
    { id: 5, title: "Control Flow and Loops", duration: "18 min" },
    { id: 6, title: "DOM Manipulation", duration: "22 min" },
    { id: 7, title: "Event Handling", duration: "15 min" },
    { id: 8, title: "Asynchronous JavaScript", duration: "30 min" },
    { id: 9, title: "Error Handling and Debugging", duration: "20 min" },
    { id: 10, title: "Modern JavaScript Features", duration: "25 min" },
  ];

  const toggleChapter = (index: number) => {
    setExpandedChapter(expandedChapter === index ? null : index);
  };

  return (
    <div className="mx-auto max-w-full p-6">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            JavaScript Fundamentals: Variables and Data Types
          </h1>
          <p className="text-muted-foreground">
            Chapter 2 of JavaScript Mastery Course
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Progress value={progress} className="w-[200px]" />
          <span className="text-sm font-medium">{progress}% Complete</span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <div className="md:col-span-3">
          <Card>
            <div className="relative aspect-video overflow-hidden rounded-t-lg">
              <iframe
                className="h-full w-full"
                src="https://www.youtube.com/embed/Zi-Q0t4gMC"
                frameBorder="0"
                allowFullScreen
                title="Chapter Video"
              ></iframe>
            </div>
            <CardHeader>
              <CardTitle>Variables and Data Types in JavaScript</CardTitle>
              <CardDescription>
                Learn the fundamentals of working with variables and
                understanding different data types in JavaScript.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">15:30 minutes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    <span className="text-sm">Chapter 2 of 10</span>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Download Resources
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                In this chapter, we&apos;ll dive deep into the concept of
                variables and data types in JavaScript. You&apos;ll learn how to
                declare variables using let, const, and var, understand the
                differences between primitive and reference data types, and
                practice working with strings, numbers, booleans, and objects.
              </p>
            </CardContent>
          </Card>

          <Tabs defaultValue="doubts" className="mt-6">
            <TabsList>
              <TabsTrigger value="assignment">Assignment</TabsTrigger>
              <TabsTrigger value="doubts">Doubts</TabsTrigger>
              <TabsTrigger value="transcript">Transcript</TabsTrigger>
            </TabsList>
            <TabsContent value="assignment">
              <Card>
                <CardHeader>
                  <CardTitle>Assignment</CardTitle>
                  <CardDescription>
                    Complete the assignment for this chapter. You can submit
                    your answers at any time.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Start typing your notes here..."
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    className="min-h-[200px]"
                  />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="doubts">
              <Card>
                <CardHeader>
                  <CardTitle>Doubts and Questions</CardTitle>
                  <CardDescription>
                    Ask your doubts or answer questions from other learners.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <div className="w-full">
                      <Editor
                        placeholder="Write your doubt here..."
                        value={doubt}
                        onChange={setDoubt}
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="rounded-lg border p-4">
                      <div className="flex items-start space-x-4">
                        <Avatar>
                          <AvatarImage src="/avatars/01.png" />
                          <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-2">
                          <p className="text-sm font-medium">John Doe</p>
                          <p className="text-sm text-muted-foreground">
                            Can someone explain the difference between let and
                            const in more detail?
                          </p>
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm">
                              <MessageSquare className="mr-2 h-4 w-4" />
                              Reply
                            </Button>
                            <Button variant="outline" size="sm">
                              <ThumbsUp className="mr-2 h-4 w-4" />
                              Helpful (3)
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-lg border p-4">
                      <div className="flex items-start space-x-4">
                        <Avatar>
                          <AvatarImage src="/avatars/02.png" />
                          <AvatarFallback>AS</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-2">
                          <p className="text-sm font-medium">Alice Smith</p>
                          <p className="text-sm text-muted-foreground">
                            How do you determine when to use different data
                            types in JavaScript?
                          </p>
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm">
                              <MessageSquare className="mr-2 h-4 w-4" />
                              Reply
                            </Button>
                            <Button variant="outline" size="sm">
                              <ThumbsUp className="mr-2 h-4 w-4" />
                              Helpful (1)
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="transcript">
              <Card>
                <CardHeader>
                  <CardTitle>Video Transcript</CardTitle>
                  <CardDescription>
                    Read along with the video content.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Welcome to Chapter 2 of our JavaScript Fundamentals course.
                    In this video, we&apos;ll be covering variables and data
                    types. Let&apos;s start by understanding what variables are
                    in JavaScript. A variable is a container for storing data
                    values. In JavaScript, we declare variables using keywords
                    like &apos;var&apos;, &apos;let&apos;, or &apos;const&apos;.
                    Each of these has its own rules and use cases...
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Course Content</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[400px] px-4">
                {courseChapters.map((chapter, index) => (
                  <div key={chapter.id} className="mb-4">
                    <div
                      className="flex cursor-pointer items-center justify-between rounded-md p-2 hover:bg-accent"
                      onClick={() => toggleChapter(index)}
                    >
                      <div className="flex items-center space-x-2">
                        <PlayCircle className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          {chapter.title}
                        </span>
                      </div>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${expandedChapter === index ? "rotate-180" : ""}`}
                      />
                    </div>
                    {expandedChapter === index && (
                      <div className="mt-2 pl-6">
                        <p className="text-xs text-muted-foreground">
                          Duration: {chapter.duration}
                        </p>
                        <Button
                          variant="link"
                          size="sm"
                          className="mt-1 p-0"
                          asChild
                        >
                          <Link
                            href={`/courses/${params.courseId}/${chapter.id}`}
                          >
                            Start Chapter
                          </Link>
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Chapter Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm">Watch Chapter Video</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="h-5 w-5 rounded-full border-2 border-muted"></div>
                  <span className="text-sm">Complete Quiz</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="h-5 w-5 rounded-full border-2 border-muted"></div>
                  <span className="text-sm">Submit Coding Exercise</span>
                </li>
              </ul>
              <Button className="mt-4 w-full">Mark Chapter as Complete</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Next Up</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                    <BookOpen className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Functions and Scope</h3>
                  <p className="text-xs text-muted-foreground">
                    Chapter 3 • 20 min
                  </p>
                </div>
              </div>
              <Button variant="outline" className="mt-4 w-full">
                Start Next Chapter
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
