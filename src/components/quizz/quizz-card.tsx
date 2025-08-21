import { AdminGetQuizzezType } from "@/app/data/admin/admin-get-quizzez";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export function QuizCard({ data }: { data: AdminGetQuizzezType }) {
  return (
    <Card>
      <CardContent className="gap-y-4 flex flex-col relative">
        <h2>{data.title}</h2>
        <div className="flex items-center flex-col">
          <p>{data.description}</p>
        </div>
        <Badge className="w-16 h-6 rounded absolute self-end">
          {data.timeLimit} minutes
        </Badge>
      </CardContent>
    </Card>
  );
}

export function QuizCardSkeleton() {
  return (
    <Card>
      <CardContent className="gap-y-4 flex flex-col relative">
        <Skeleton className="w-2/4 h-10 rounded mb-2" />
        <div className="flex items-center flex-col">
          <Skeleton className="w-full h-6 rounded mb-2" />
          <Skeleton className="w-full h-6 rounded" />
        </div>
        <Skeleton className="w-16 h-6 rounded absolute self-end" />
      </CardContent>
    </Card>
  );
}
