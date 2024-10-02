"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageSquare, ThumbsUp } from "lucide-react";

const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

export const Doubts = ({ courseId }: { courseId: string }) => {
  const [doubt, setDoubt] = useState("");
  const [noteContent, setNoteContent] = useState("");

  return (
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
              Complete the assignment for this chapter. You can submit your
              answers at any time.
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
                      Can someone explain the difference between let and const
                      in more detail?
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
                      How do you determine when to use different data types in
                      JavaScript?
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
              Welcome to Chapter 2 of our JavaScript Fundamentals course. In
              this video, we&apos;ll be covering variables and data types.
              Let&apos;s start by understanding what variables are in
              JavaScript. A variable is a container for storing data values. In
              JavaScript, we declare variables using keywords like
              &apos;var&apos;, &apos;let&apos;, or &apos;const&apos;. Each of
              these has its own rules and use cases...
            </p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};
