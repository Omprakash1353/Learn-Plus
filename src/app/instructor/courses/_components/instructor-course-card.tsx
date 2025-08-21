import {
  ArrowRight,
  Eye,
  MoreVertical,
  Pencil,
  School,
  TimerIcon,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { InstructorCoursesType } from "@/app/data/instructor/instructor-get-courses";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useConstructUrl } from "@/hooks/use-construct-url";

interface Props {
  data: InstructorCoursesType;
}

export function InstructorCourseCard({ data }: Props) {
  const thumbnailURL = useConstructUrl(data.fileKey);

  return (
    <Card className="group relative gap-0 py-0">
      <div className="top-2 right-2 z-10 absolute">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon">
              <MoreVertical className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem asChild>
              <Link href={`/instructor/courses/${data.id}/edit`}>
                <Pencil className="mr-2 size-4" /> Edit Course
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/courses/${data.slug}`}>
                <Eye className="mr-2 size-4" /> Preview
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/instructor/courses/${data.id}/delete`}>
                <Trash2 className="mr-2 size-4 text-destructive" /> Delete
                Course
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Image
        className="rounded-t-lg w-full h-full object-cover aspect-video"
        src={thumbnailURL}
        alt={data.title}
        width={600}
        height={600}
      />
      <CardContent className="p-4">
        <Link
          href={`/instructor/courses/${data.id}`}
          className="font-medium group-hover:text-primary text-lg hover:underline line-clamp-2 transition-colors"
        >
          {data.title}
        </Link>
        <p className="mt-2 text-muted-foreground text-sm line-clamp-2 leading-tight">
          {data.smallDescription}
        </p>

        <div className="flex items-center gap-x-5 mt-4">
          <div className="flex items-center gap-x-2">
            <TimerIcon className="bg-primary/10 p-1 rounded-md size-6 text-primary" />
            <p className="text-muted-foreground text-sm">{data.duration}</p>
          </div>
          <div className="flex items-center gap-x-2">
            <School className="bg-primary/10 p-1 rounded-md size-6 text-primary" />
            <p className="text-muted-foreground text-sm">{data.level}</p>
          </div>
        </div>

        <Link
          href={`/instructor/courses/${data.id}/edit`}
          className={buttonVariants({
            className: "w-full mt-4",
          })}
        >
          Edit Course <ArrowRight className="size-4" />
        </Link>
      </CardContent>
    </Card>
  );
}
