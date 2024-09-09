import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getImage } from "./custom/dynamic-image";
import { Badge } from "./ui/badge";

type CourseProgressCardProps = {
  id: string;
  img: string;
  title: string;
  description: string;
};

export function CourseProgressCard(props: CourseProgressCardProps) {
  return (
    <Link href={"/courses/12345"}>
      <Card className="w-full max-w-sm">
        <div className="relative h-[200px]">
          <Image
            src={props.img}
            alt={props.title}
            width="400"
            height="200"
            className="h-full w-full rounded-t-lg object-cover"
            style={{ aspectRatio: "400/200", objectFit: "cover" }}
          />
          <Badge className="absolute left-4 top-4 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
            75% Complete
          </Badge>
        </div>
        <CardContent className="space-y-4 p-6">
          <div>
            <CardTitle className="line-clamp-1 text-lg font-semibold">
              {props.title}
            </CardTitle>
            <CardDescription className="mt-1 line-clamp-2 text-sm text-muted-foreground">
              {props.description}
            </CardDescription>
          </div>
          <Progress value={75} aria-label="75% complete" className="" />
        </CardContent>
      </Card>
    </Link>
  );
}

type CourseEnrollmentCardProps = {
  id: string | number;
  img: string;
  title: string;
  description: string;
  chapters: number;
  duration: string;
  price: number;
};

export function CourseEnrollmentCard(props: CourseEnrollmentCardProps) {
  // const { base64, img } = await getImage(props.img);
  return (
    <Link href={`/courses/${props.id}`}>
      <Card className="w-full max-w-sm cursor-pointer transition-shadow duration-300 hover:shadow-lg">
        <div className="relative">
          <Image
            src={props.img}
            alt={props.title}
            width={400}
            height={200}
            className="h-[200px] w-full rounded-t-lg object-cover duration-300 transition-all"
            style={{ aspectRatio: "400/200", objectFit: "cover" }}
            priority
          />
          <Badge className="absolute right-4 top-4 rounded-full bg-primary px-3 py-1 text-sm font-medium text-primary-foreground">
            $ {props.price}
          </Badge>
        </div>
        <CardContent className="space-y-4 p-6">
          <div>
            <CardTitle className="line-clamp-1 text-lg font-semibold">
              {props.title}
            </CardTitle>
            <CardDescription className="mt-1 line-clamp-2 text-sm text-muted-foreground">
              {props.description}
            </CardDescription>
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center text-emerald-500">
              <Clock className="mr-1 h-4 w-4" />
              <span>{props.duration} hr</span>
            </div>
            <div className="flex items-center text-blue-600 duration-200 dark:text-blue-400">
              <BookOpen className="mr-1 h-4 w-4" />
              <span>{props.chapters} chapters</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
