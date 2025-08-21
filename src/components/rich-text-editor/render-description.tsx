"use client";

import TextAlign from "@tiptap/extension-text-align";
import { generateHTML, type JSONContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import parser from "html-react-parser";
import { useEffect, useMemo, useState } from "react";

export function RenderDescription({ json }: { json: JSONContent | null }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const parsedContent = useMemo(() => {
    if (!mounted || !json) return null;

    const html = generateHTML(json, [
      StarterKit,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ]);

    return parser(html);
  }, [mounted, json]);

  return (
    <div className="dark:prose-invert prose-li:marker:text-primary prose">
      {parsedContent}
    </div>
  );
}
