import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is missing in environment variables");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  // ✅ Switch to the optimized high-volume production endpoint
  model: "gemini-3.1-flash-lite", 
});

export default model;