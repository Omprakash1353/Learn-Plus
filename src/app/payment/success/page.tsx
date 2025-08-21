import { ArrowLeft, CheckIcon } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function PaymentSucceed() {
  return (
    <div className="flex flex-1 justify-center items-center w-full min-h-screen">
      <Card className="w-[350px]">
        <CardContent>
          <div className="flex justify-center w-full">
            <CheckIcon className="bg-green-500/30 p-2 rounded-full size-12 text-green-500" />
          </div>
          <div className="mt-3 sm:mt-5 w-full text-center">
            <h2 className="font-semibold text-xl">Payment Successfull</h2>
            <p className="mt-2 text-muted-foreground text-sm text-balance tracking-tight">
              Congrats your payment was successfull. You should now have access
              to the course !
            </p>

            <Link
              href="/dashboard"
              className={buttonVariants({ className: "w-full mt-5" })}
            >
              <ArrowLeft className="size-4" />
              Go to Dashboard
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
