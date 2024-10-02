import { BookOpen, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardTitle
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "./ui/badge";

type CourseProgressCardProps = {
  progressPercentage: number;
  id: string | null;
  thumbnailUrl: string | null | undefined;
  title: string | undefined;
};

export function CourseProgressCard(props: CourseProgressCardProps) {
  return (
    <Link href={`/courses/${props?.id}`}>
      <Card className="w-full max-w-sm">
        <div className="relative h-[200px]">
          <Image
            src={props?.thumbnailUrl || ""}
            alt={props?.title || ""}
            width="400"
            height="200"
            className="h-full w-full rounded-t-lg object-cover"
            style={{ aspectRatio: "400/200", objectFit: "cover" }}
          />
          <Badge className="absolute left-4 top-4 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
            {props.progressPercentage}% Complete
          </Badge>
        </div>
        <CardContent className="space-y-4 p-6">
          <div>
            <CardTitle className="line-clamp-1 text-lg font-semibold">
              {props.title}
            </CardTitle>
          </div>
          <Progress
            value={props.progressPercentage}
            aria-label={`${props.progressPercentage}% complete`}
            className=""
          />
        </CardContent>
      </Card>
    </Link>
  );
}

type CourseEnrollmentCardProps = {
  courseDetails: {
    chapters: number;
    tags: string[];
    duration: number;
    id: string;
    title: string;
    price: number | null;
    thumbnailUrl: string | null;
  };
};

export function CourseEnrollmentCard({
  courseDetails,
}: CourseEnrollmentCardProps) {
  return (
    <Link href={`/courses/${courseDetails.id}`}>
      <Card className="w-full max-w-sm cursor-pointer transition-shadow duration-300 hover:shadow-lg">
        <div className="relative">
          {courseDetails.thumbnailUrl ? (
            <Image
              src={courseDetails.thumbnailUrl}
              alt={courseDetails.title}
              width={400}
              height={200}
              className="h-[200px] w-full rounded-t-lg object-cover transition-all duration-300"
              style={{ aspectRatio: "400/200", objectFit: "cover" }}
              priority
            />
          ) : (
            <Image
              src={"/placeholder.svg"}
              alt={courseDetails.title}
              width={400}
              height={200}
              className="h-[200px] w-full rounded-t-lg object-cover transition-all duration-300"
            />
          )}
          <Badge className="absolute right-4 top-4 rounded-full bg-primary px-3 py-1 text-sm font-medium text-primary-foreground">
            $ {courseDetails.price}
          </Badge>
        </div>
        <CardContent className="space-y-4 p-6">
          <div>
            <CardTitle className="line-clamp-1 text-base font-semibold">
              {courseDetails.title}
            </CardTitle>
            {/* <CardDescription className="mt-1 line-clamp-2 text-sm text-muted-foreground">
              {"Lorem232123 34234"}
            </CardDescription> */}
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center text-emerald-500">
              <Clock className="mr-1 h-4 w-4" />
              <span>{courseDetails.duration} hr</span>
            </div>
            <div className="flex items-center text-blue-600 duration-200 dark:text-blue-400">
              <BookOpen className="mr-1 h-4 w-4" />
              <span>{courseDetails.chapters} chapters</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
