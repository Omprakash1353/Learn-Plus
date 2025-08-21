"use client";

import TextAlign from "@tiptap/extension-text-align";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Info, Loader2, SparkleIcon, Sparkles } from "lucide-react";
import { useState, useTransition } from "react";
import { ControllerRenderProps, Path } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Menubar } from "./menubar";

function cleanAIResponse(content: string): string {
  let cleaned = content.trim();

  const codeBlockPatterns = [
    /^```html\s*/i,
    /^```\s*html\s*/i,
    /^```\s*/,
    /\s*```$/,
    /^`{1,3}\s*/,
    /\s*`{1,3}$/,
  ];

  codeBlockPatterns.forEach((pattern) => {
    cleaned = cleaned.replace(pattern, "");
  });

  cleaned = cleaned
    .replace(/^#+\s*/gm, "")
    .replace(/\n\s*\n\s*\n/g, "\n\n")
    .trim();

  return cleaned;
}

function getEditorContent(value: unknown): string | object {
  if (typeof value === "string" && value.trim()) {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }

  if (typeof value === "object" && value !== null) {
    return value;
  }

  return "<p>Start writing your course description...</p>";
}

type RichTextEditorProps<T extends Record<string, unknown>> = {
  field: ControllerRenderProps<T, Path<T>>;
  topic: string;
  description?: string;
};

export function RichTextEditor<T extends Record<string, unknown>>({
  field,
  topic,
  description,
}: RichTextEditorProps<T>) {
  const [pending, startTransition] = useTransition();
  const [customPrompt, setCustomPrompt] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "min-h-[300px] p-4 focus:outline-none prose prose-sm sm:prose lg:prose-lg xl:prose-xl dark:prose-invert !w-full !max-w-none",
      },
    },
    onUpdate: ({ editor }) => {
      field.onChange(JSON.stringify(editor.getJSON()));
    },
    content: getEditorContent(field.value),
  });

  function handleGenerateDescription() {
    startTransition(async () => {
      try {
        const promptToUse =
          customPrompt.trim() ||
          description ||
          `Generate description for ${topic}`;

        editor?.commands.setContent("<p>Generating content...</p>");

        const response = await fetch(`/api/ai/stream`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            topic,
            description: promptToUse,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        if (!response.body) {
          throw new Error("Response body is null");
        }

        setIsDialogOpen(false);

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let accumulatedContent = "";

        try {
          while (true) {
            const { done, value } = await reader.read();

            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split("\n");

            for (const line of lines) {
              if (line.startsWith("data: ")) {
                try {
                  const data = JSON.parse(line.slice(6));

                  if (data.error) {
                    throw new Error(data.message || "Streaming error");
                  }

                  if (data.accumulated) {
                    accumulatedContent = data.accumulated;
                    const cleanedContent = cleanAIResponse(accumulatedContent);

                    editor?.commands.setContent(cleanedContent);
                    field.onChange(JSON.stringify(editor?.getJSON()));
                  }

                  if (data.done) {
                    const finalCleanedContent =
                      cleanAIResponse(accumulatedContent);
                    editor?.commands.setContent(finalCleanedContent);
                    field.onChange(JSON.stringify(editor?.getJSON()));

                    toast.success("Description generated successfully!");
                    setIsDialogOpen(false);
                    setCustomPrompt("");
                    return;
                  }
                } catch (parseError) {
                  console.warn("Failed to parse streaming data:", parseError);
                }
              }
            }
          }
        } finally {
          reader.releaseLock();
        }
      } catch (error) {
        console.error("Error generating content:", error);
        toast.error("Failed to generate description. Please try again.");

        editor?.commands.setContent(getEditorContent(field.value) as string);
      }
    });
  }

  return (
    <>
      <div className="dark:bg-input/30 border border-input rounded-lg w-full overflow-hidden">
        <Menubar editor={editor} />
        <EditorContent editor={editor} />
      </div>
      <div className="flex justify-end">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button type="button">
              Generate Description <SparkleIcon className="size-4 ml-1" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
                <Sparkles className="size-5 text-primary" />
                AI Description Generator
              </DialogTitle>
              <DialogDescription className="mt-2 flex items-start gap-2 text-sm text-muted-foreground">
                <Info className="size-4 text-amber-500 mt-0.5 shrink-0" />
                Use the brief description by default or enter a custom prompt to
                guide the AI in generating a tailored course description.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-2 space-y-2">
              <Label htmlFor="customPrompt" className="text-sm font-medium">
                Custom Prompt{" "}
                <span className="text-muted-foreground">(optional)</span>
              </Label>
              <Textarea
                id="customPrompt"
                placeholder={`e.g. Highlight key modules and who this course is best for`}
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                className="min-h-[120px]"
              />
              <p className="text-xs text-muted-foreground text-right">
                {customPrompt.length}/500 characters
              </p>
            </div>

            <DialogFooter className="mt-6">
              <Button
                variant="outline"
                type="button"
                onClick={() => {
                  setIsDialogOpen(false);
                  setCustomPrompt("");
                }}
              >
                Cancel
              </Button>
              <Button
                disabled={pending}
                type="button"
                onClick={handleGenerateDescription}
              >
                {pending ? (
                  <>
                    <Loader2 className="size-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="size-4 mr-2" />
                    Generate
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
