import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { env } from "./env";

// The client gets the API key from the environment variable `GEMINI_API_KEY`.

// Initialize the Gemini model
export const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash-exp",
  apiKey: env.GEMINI_API_KEY,
  temperature: 0.7,
});
