const buildInterviewReviewPrompt = ({
  company,
  role,
  interviewType,
  difficulty,
  conversation,
}) => {
  return `
You are a Senior Hiring Manager at ${company}.

You have just completed an interview.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INTERVIEW DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Company:
${company}

Role:
${role}

Interview Type:
${interviewType}

Difficulty:
${difficulty}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INTERVIEW CONVERSATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${conversation}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
YOUR TASK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Carefully analyze the entire interview.

Evaluate the candidate on:

• Technical Knowledge

• Communication

• Confidence

• Overall Performance

Return ONLY valid JSON.

Do not use markdown.

Do not explain anything.

Do not wrap JSON in quotes.

Use exactly this format.

{
  "overallScore": 85,
  "technicalScore": 90,
  "communicationScore": 82,
  "confidenceScore": 80,
  "strengths": [
      "...",
      "...",
      "..."
  ],
  "weaknesses": [
      "...",
      "...",
      "..."
  ],
  "suggestions": [
      "...",
      "...",
      "..."
  ],
  "hiringDecision": "Recommended"
}
`;
};

export default buildInterviewReviewPrompt;
