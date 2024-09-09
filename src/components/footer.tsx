import { Github, LinkedinIcon } from "lucide-react";
import { Button } from "./ui/button";

export function Footer() {
  return (
    <footer className="absolute bottom-0 left-0 right-0 border-t bg-background px-10 text-base font-semibold text-[#0a0a0a] dark:text-gray-300">
      <div className="flex h-16 flex-col items-center justify-between px-10 md:flex-row">
        <div className="flex flex-wrap items-center justify-center gap-3 text-center text-sm">
          <Button variant={"ghost"} size={"sm"} aria-label="Trademark Policy">
            Trademark Policy
          </Button>
          <Button variant={"ghost"} size={"sm"} aria-label="Privacy Policy">
            Privacy Policy
          </Button>
          <Button variant={"ghost"} size={"sm"} aria-label="Code of Conduct">
            Code of Conduct
          </Button>
          <Button variant={"ghost"} size={"sm"} aria-label="Security Policy">
            Security Policy
          </Button>
        </div>
        <div className="mt-4 flex items-center justify-center gap-5 md:mt-0">
          <Button variant={"ghost"} size={"icon"} aria-label="Github">
            <Github />
          </Button>
          <Button variant={"ghost"} size={"icon"} aria-label="Linkedin">
            <LinkedinIcon />
          </Button>
        </div>
      </div>
    </footer>
  );
}
