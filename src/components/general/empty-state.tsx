import { Ban, PlusCircle } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "../ui/button";

interface Props {
  title: string;
  description: string;
  buttonText: string;
  href: string;
}

export function EmptyState({ title, description, buttonText, href }: Props) {
  return (
    <div className="flex flex-col flex-1 justify-center items-center p-8 border border-dashed rounded-md h-full text-center animate-in fade-in-50">
      <div className="flex justify-center items-center bg-primary/10 rounded-full size-20">
        <Ban className="size-10 text-primary" />
      </div>
      <h2 className="mt-6 font-semibold text-xl">{title}</h2>
      <p className="mt-2 mb-8 text-muted-foreground text-sm text-center leading-tight">
        {description}
      </p>
      <Link href={href} className={buttonVariants()}>
        <PlusCircle className="mr-2 size-4" />
        {buttonText}
      </Link>
    </div>
  );
}
