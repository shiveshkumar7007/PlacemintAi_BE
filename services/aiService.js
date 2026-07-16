import model from "../config/ai.js";

const analyzeResume = async (resumeText) => {
  const prompt = `
    You are an expert HR recruiter. Analyze the following resume text.
    Provide a score from 0 to 100, a list of strengths, a list of weaknesses, and actionable suggestions.
    
    You MUST return your response matching this exact JSON structure:
    {
      "score": number,
      "strengths": ["string"],
      "weaknesses": ["string"],
      "suggestions": ["string"]
    }

    Resume Text:
    ${resumeText}
  `;

  // 🔄 Update this specific block:
  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      responseMimeType: "application/json", // 
    },
  });

  const responseText = result.response.text();
  return JSON.parse(responseText);
};

export default analyzeResume;
