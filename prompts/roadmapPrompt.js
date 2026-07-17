const buildRoadmapPrompt = ({
  company,
  role,
  targetDays,
  skillLevel,
  dailyStudyHours,
}) => {
  return `
You are a Senior Software Engineer and Technical Interview Mentor.

Create a highly personalized interview preparation roadmap.

===========================
USER DETAILS
===========================

Company:
${company}

Role:
${role}

Preparation Duration:
${targetDays} Days

Current Skill:
${skillLevel}

Daily Study Hours:
${dailyStudyHours}

===========================
IMPORTANT RULES
===========================

1. Divide the roadmap into exactly ${targetDays} days.

2. Every day should have:

- day
- title
- topics
- tasks
- revisionNotes

3. Topics should gradually increase in difficulty.

4. Do NOT overload the user.

5. Match the workload according to ${dailyStudyHours} study hours per day.

6. Include revision frequently.

7. Include mock interviews near the end.

8. Include company-focused preparation.

9. Return ONLY JSON.

10. Do NOT return markdown.

11. Do NOT explain anything.

===========================
JSON FORMAT
===========================

{
  "roadmap":[
    {
      "day":1,
      "title":"Arrays Basics",
      "topics":[
        "Arrays",
        "Time Complexity"
      ],
      "tasks":[
        "Learn Array Traversal",
        "Solve Two Sum",
        "Solve Best Time to Buy Stock"
      ],
      "revisionNotes":"Revise Arrays before Day 2"
    }
  ]
}
`;
};

export default buildRoadmapPrompt;
