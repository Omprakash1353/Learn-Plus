import { ArrowLeft, XIcon } from "lucide-react";
import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";

export default function PaymentCancelled() {
  return (
    <div className="flex flex-1 justify-center items-center w-full min-h-screen">
      <Card className="w-[350px]">
        <CardContent>
          <div className="flex justify-center w-full">
            <XIcon className="bg-red-500/30 p-2 rounded-full size-12 text-red-500" />
          </div>
          <div className="mt-3 sm:mt-5 w-full text-center">
            <h2 className="font-semibold text-xl">Payment Cancelled</h2>
            <p className="mt-2 text-muted-foreground text-sm text-balance tracking-tight">
              No worries, you won&apos;t be charged. Please try again !
            </p>

            <Link
              href="/"
              className={buttonVariants({ className: "w-full mt-5" })}
            >
              <ArrowLeft className="size-4" />
              Go back to HomePage
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
