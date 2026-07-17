import { GoogleGenerativeAI } from "@google/generative-ai";
import buildRoadmapPrompt from "../prompts/roadmapPrompt.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-3.1-flash-lite",
});

const extractJSON = (text) => {
  let cleaned = text.trim();

  // Remove markdown if Gemini returns ```json
  cleaned = cleaned.replace(/^```json\s*/i, "");
  cleaned = cleaned.replace(/^```\s*/i, "");
  cleaned = cleaned.replace(/```$/i, "");

  return cleaned.trim();
};

const validateRoadmap = (roadmap, targetDays) => {
  if (!Array.isArray(roadmap)) {
    throw new Error("Gemini returned an invalid roadmap.");
  }

  if (roadmap.length !== targetDays) {
    throw new Error(
      `Expected ${targetDays} days but Gemini returned ${roadmap.length}.`,
    );
  }

  roadmap.forEach((day, index) => {
    if (day.day !== index + 1) {
      throw new Error(`Invalid day numbering at Day ${index + 1}`);
    }

    if (!day.title) {
      throw new Error(`Missing title for Day ${index + 1}`);
    }

    if (!Array.isArray(day.topics)) {
      throw new Error(`Topics missing for Day ${index + 1}`);
    }

    if (!Array.isArray(day.tasks)) {
      throw new Error(`Tasks missing for Day ${index + 1}`);
    }

    if (typeof day.revisionNotes !== "string") {
      day.revisionNotes = "";
    }

    day.completed = false;
    day.completedAt = null;
  });

  return roadmap;
};

const generateRoadmap = async ({
  company,
  role,
  targetDays,
  skillLevel,
  dailyStudyHours,
}) => {
  const prompt = buildRoadmapPrompt({
    company,
    role,
    targetDays,
    skillLevel,
    dailyStudyHours,
  });

  const result = await model.generateContent(prompt);

  const response = await result.response;

  const text = response.text();

  const jsonString = extractJSON(text);

  let parsed;

  try {
    parsed = JSON.parse(jsonString);
  } catch {
    throw new Error("Failed to parse Gemini JSON response.");
  }

  if (!parsed.roadmap) {
    throw new Error("Gemini response does not contain roadmap.");
  }

  return validateRoadmap(parsed.roadmap, targetDays);
};

export default generateRoadmap;
