import { and, asc, eq, inArray } from "drizzle-orm";
import parse from "html-react-parser";
import { generateId } from "lucia";
import { BookOpen, CheckCircle, Circle, Lock, PlayCircle } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { db } from "@/lib/db";
import {
  chapterTable,
  enrollmentTable,
  userProgressTable,
} from "@/lib/db/schema";
import { validateRequest } from "@/lib/lucia";
import { Doubts } from "./_components/doubt";
import { MarkChapterComplete } from "./_components/mark-chapter-complete";
import { VideoPlayer } from "./_components/video-player";

export default async function EnhancedChapterView({
  params,
}: {
  params: { chapterId: string; courseId: string };
}) {
  const { user } = await validateRequest();
  if (!user) return redirect("/");

  const chapter = await db.query.chapterTable.findFirst({
    where: eq(chapterTable.id, params.chapterId),
    with: {
      video: true,
      course: true,
      userChapterProgress: {
        where: and(
          eq(userProgressTable.chapterId, params.chapterId),
          eq(userProgressTable.userId, user.id),
        ),
      },
    },
  });

  if (!chapter) return redirect("not-found");

  const enrollment = await db.query.enrollmentTable.findFirst({
    where: and(
      eq(enrollmentTable.courseId, params.courseId),
      eq(enrollmentTable.userId, user.id),
    ),
  });

  if (!chapter.userChapterProgress[0] && (chapter.isFree || enrollment)) {
    await db.insert(userProgressTable).values({
      id: generateId(15),
      userId: user.id,
      chapterId: params.chapterId,
      isCompleted: false,
    });
  }

  const courseChapters = await db
    .select({
      id: chapterTable.id,
      title: chapterTable.title,
      order: chapterTable.order,
      isFree: chapterTable.isFree,
    })
    .from(chapterTable)
    .where(
      and(
        eq(chapterTable.courseId, params.courseId),
        eq(chapterTable.status, "PUBLISHED"),
      ),
    )
    .orderBy(asc(chapterTable.order));

  const courseChapterIds = courseChapters.map((chapter) => chapter.id);

  const userProgress = await db.query.userProgressTable.findMany({
    where: and(
      eq(userProgressTable.userId, user.id),
      inArray(userProgressTable.chapterId, courseChapterIds),
      eq(userProgressTable.isCompleted, true),
    ),
    with: {
      chapter: true,
    },
  });

  const totalChapters = courseChapters.length;
  const completedChapters = userProgress.length;
  const completionPercentage =
    totalChapters > 0
      ? Math.round((completedChapters / totalChapters) * 100)
      : 0;

  const currentChapterIndex = courseChapters.findIndex(
    (chp) => chp.id === params.chapterId,
  );
  const nextChapter = courseChapters[currentChapterIndex + 1];

  const hasAccess = !!enrollment || !!chapter.isFree;

  return (
    <div className="mx-auto max-w-full p-6">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">{chapter?.course?.title}</h1>
          <p className="text-muted-foreground">
            Chapter {chapter.order} of {chapter?.course?.title}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Progress value={completionPercentage} className="w-[200px]" />
          <span className="text-sm font-medium">
            {completionPercentage}% Complete
          </span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <div className="md:col-span-3">
          <Card>
            <VideoPlayer
              courseId={params.courseId}
              chapter={chapter}
              nextChapter={nextChapter}
              hasAccess={hasAccess}
            />
            <CardHeader>
              <CardTitle>{chapter.title}</CardTitle>
              {chapter?.description && (
                <div className="text-muted-foreground">
                  {parse(chapter?.description)}
                </div>
              )}
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    <span className="text-sm">
                      Chapter {chapter.order} of {totalChapters}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Doubts courseId={params.courseId} />
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Course Content</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[400px]">
                {courseChapters.map((chp) => (
                  <Link
                    key={chp.id}
                    href={`/courses/${params.courseId}/${chp.id}`}
                  >
                    <div
                      className={`p-4 transition-colors hover:bg-muted/50 ${
                        userProgress.some((prog) => prog.chapterId === chp.id)
                          ? "text-blue-400"
                          : ""
                      }`}
                    >
                      <div className="flex items-center justify-between transition-colors hover:bg-muted/50">
                        <div className="flex items-center space-x-2">
                          <PlayCircle className="h-4 w-4 text-muted-foreground" />
                          <span className="flex-grow text-sm font-medium hover:underline">
                            {chp.title}
                          </span>
                        </div>
                        {!chp.isFree && (
                          <Lock className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                  </Link>
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
                  {chapter.userChapterProgress[0]?.isCompleted ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <Circle className="h-5 w-5 rounded-full bg-muted" />
                  )}
                  <span className="text-sm">Completed Chapter</span>
                </li>
              </ul>
              {!chapter.userChapterProgress[0]?.isCompleted && (
                <MarkChapterComplete
                  hasAccess={hasAccess}
                  courseId={params.courseId}
                  chapterId={params.chapterId}
                />
              )}
            </CardContent>
          </Card>

          {nextChapter && (
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
                    <h3 className="text-sm font-medium">{nextChapter.title}</h3>
                    <p className="text-xs text-muted-foreground">
                      Chapter {nextChapter.order}
                    </p>
                  </div>
                </div>
                <Button variant="outline" className="mt-4 w-full" asChild>
                  <Link href={`/courses/${params.courseId}/${nextChapter.id}`}>
                    Start Next Chapter
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
