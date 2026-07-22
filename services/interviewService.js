import { GoogleGenerativeAI } from "@google/generative-ai";

import buildInterviewPrompt from "../prompts/interviewPrompt.js";
import buildNextInterviewPrompt from "../prompts/interviewNextPrompt.js";
import buildInterviewReviewPrompt from "../prompts/interviewReviewPrompt.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-3.1-flash-lite",
});

export const generateFirstQuestion = async (data) => {
  const prompt = buildInterviewPrompt(data);

  const result = await model.generateContent(prompt);

  return result.response.text().trim();
};

const formatConversation = (conversation) => {
  return conversation
    .map((msg) => `${msg.speaker}: ${msg.message}`)
    .join("\n\n");
};

export const generateNextQuestion = async ({
  company,
  role,
  interviewType,
  difficulty,
  duration,
  language,
  mode,
  description,
  conversation,
}) => {
  const formattedConversation = formatConversation(conversation);

  const prompt = buildNextInterviewPrompt({
    company,
    role,
    interviewType,
    difficulty,
    duration,
    language,
    mode,
    description,
    conversation: formattedConversation,
  });

  const result = await model.generateContent(prompt);

  return result.response.text().trim();
};

export const generateInterviewReview = async ({
  company,
  role,
  interviewType,
  difficulty,
  conversation,
}) => {
  const formattedConversation = formatConversation(conversation);

  const prompt = buildInterviewReviewPrompt({
    company,
    role,
    interviewType,
    difficulty,
    conversation: formattedConversation,
  });

  const result = await model.generateContent(prompt);

  let response = result.response.text().trim();

  // Remove markdown if Gemini wraps JSON
  response = response
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  try {
    return JSON.parse(response);
  } catch (error) {
    throw new Error("Failed to parse interview review JSON.");
  }
};
