"use client";

import { useEffect, useState } from "react";

export function BreakpointIndicator() {
  const [breakpoint, setBreakpoint] = useState("");

  useEffect(() => {
    const updatedBreakpoint = () => {
      const width = window.innerWidth;
      if (width < 640) setBreakpoint("xs");
      else if (width < 768) setBreakpoint("sm");
      else if (width < 1024) setBreakpoint("md");
      else if (width < 1280) setBreakpoint("lg");
      else if (width < 1536) setBreakpoint("xl");
      else setBreakpoint("2xl");
    };

    updatedBreakpoint();
    window.addEventListener("resize", updatedBreakpoint);

    return () => window.removeEventListener("resize", updatedBreakpoint);
  }, []);

  return (
    <div className="fixed bottom-10 right-10 z-50 rounded-full bg-gray-800 px-3 py-1 text-sm text-white opacity-75">
      {breakpoint}
    </div>
  );
}
