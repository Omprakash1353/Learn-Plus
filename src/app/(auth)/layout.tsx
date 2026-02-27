import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";

import { buttonVariants } from "@/components/ui/button";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      <Link
        href="/"
        className={buttonVariants({
          variant: "outline",
          className: "absolute top-4 left-4 z-100",
        })}
      >
        <ArrowLeft className="size-4" /> Back
      </Link>
      <div className="absolute inset-0 flex justify-center items-center blur-[60px]">
        <div
          className="top-[-25%] left-1/2 sm:left-[calc(50%-30rem)] absolute bg-gradient-to-tr from-blue-900 to-primary-muted opacity-30 blur-3xl w-[36.125rem] sm:w-[72.1875rem] aspect-[1155/678] rotate-[30deg] -translate-x-1/2 animate-slide-1"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            filter: "blur(20px)",
          }}
        ></div>
        <div
          className="bottom-0 left-[calc(50%+3rem)] sm:left-[calc(50%+36rem)] absolute bg-gradient-to-tr from-blue-900 to-green-900 opacity-30 blur-3xl w-[36.125rem] sm:w-[72.1875rem] aspect-[1155/678] -translate-x-1/2 animate-slide-2"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            filter: "blur(20px)",
          }}
        ></div>
      </div>
      <div className="z-10 relative flex flex-col justify-center items-center gap-6 w-full h-full">
        <Link
          className="flex justify-center items-center self-center gap-2 font-medium text-xl"
          href="/"
        >
          <Image
            src="/logo.png"
            alt="Nexus Learn logo"
            width={30}
            height={30}
          />
          Nexus Learn
        </Link>
        {children}
        <div className="text-muted-foreground text-xs text-center text-balance">
          By clicking continue, you agree to our{" "}
          <span className="hover:text-primary hover:underline">
            Terms of service
          </span>{" "}
          and{" "}
          <span className="hover:text-primary hover:underline">
            Privacy Policy
          </span>
        </div>
      </div>
    </div>
  );
}
