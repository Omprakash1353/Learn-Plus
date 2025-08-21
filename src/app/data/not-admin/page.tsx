import { ArrowLeft, ShieldX } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function NotAdminRoute() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="bg-destructive/10 mx-auto p-4 rounded-full w-fit">
            <ShieldX className="size-16 text-destructive" />
          </div>
          <CardTitle className="text-2xl">Access Restricted</CardTitle>
          <CardDescription>
            Hey! You are not admin, which mean you can&apos;t create any courses
            or stuff like that...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/" className={buttonVariants({ className: "w-full" })}>
            <ArrowLeft className="mr-1 size-4" />
            Back to home
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
