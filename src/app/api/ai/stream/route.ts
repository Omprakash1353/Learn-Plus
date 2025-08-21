import { model } from "@/lib/ai";
import { PromptTemplate } from "@langchain/core/prompts";
import { NextRequest } from "next/server";

type StreamingEvent =
  | { type: "start"; message: string }
  | { type: "chunk"; content: string; accumulated: string }
  | { type: "complete"; content: string }
  | { type: "error"; error: string; message: string };

const promptTemplate = PromptTemplate.fromTemplate(`
Create a detailed course description for the topic "{topic}".
{description}

Requirements:
- Write in a professional, engaging tone
- Include key learning objectives
- Mention target audience
- Highlight benefits and outcomes
- Keep it between 150-200 words
- Format as clean HTML that works with TipTap editor
- Use proper tags and formatting

Return the content as valid HTML without any JSON wrapper.
`);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { topic, description } = body as {
      topic: string;
      description: string;
    };

    if (!topic && !description) {
      return new Response(
        JSON.stringify({ error: "Topic or description is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const formattedPrompt = await promptTemplate.format({
      topic: topic || "General Course",
      description: description ? `Additional context: ${description}` : "",
    });

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        const sendEvent = (data: StreamingEvent) => {
          const eventString = `data: ${JSON.stringify(data)}\n\n`;
          controller.enqueue(encoder.encode(eventString));
        };

        try {
          sendEvent({ type: "start", message: "Starting generation..." });

          const streamResponse = await model.stream(formattedPrompt);
          let accumulatedContent = "";

          for await (const chunk of streamResponse) {
            const content = chunk.content?.toString() || "";
            accumulatedContent += content;

            sendEvent({
              type: "chunk",
              content: content,
              accumulated: accumulatedContent,
            });
          }

          sendEvent({
            type: "complete",
            content: accumulatedContent,
          });

          controller.close();
        } catch (error) {
          console.error("Streaming error:", error);
          sendEvent({
            type: "error",
            error: "Failed to generate content",
            message: error instanceof Error ? error.message : String(error),
          });
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  } catch (error) {
    console.error("Error in streaming API:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to generate content",
        message: error instanceof Error ? error.message : String(error),
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
