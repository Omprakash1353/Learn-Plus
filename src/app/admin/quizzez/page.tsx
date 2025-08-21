import { QuizCardSkeleton } from "@/components/quizz/quizz-card";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function QuizzesPage() {
  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="font-bold text-2xl">Your Courses</h1>

        <Link href="/admin/quizzez/create" className={buttonVariants()}>
          Create Quiz
        </Link>
      </div>

      <QuizzezSkeletonLayout />
    </>
  );
}

function QuizzezSkeletonLayout() {
  return (
    <div className="gap-7 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 4 }).map((_, index) => (
        <QuizCardSkeleton key={index} />
      ))}
    </div>
  );
}
