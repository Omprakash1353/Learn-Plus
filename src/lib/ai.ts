import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { env } from "./env";

export const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  apiKey: env.GEMINI_API_KEY,
  temperature: 0.7,
});