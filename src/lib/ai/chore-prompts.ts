interface ChorePromptInput {
  members: { name: string; role: string; age?: number | null }[];
  weekStart: string;
  weekEnd: string;
  preferences?: string;
}

export function buildChorePrompt(input: ChorePromptInput): string {
  const memberList = input.members
    .map((m) => `- ${m.name} (${m.role}${m.age ? `, age ${m.age}` : ""})`)
    .join("\n");

  return `Generate a weekly chore schedule for a household with these members:
${memberList}

Week: ${input.weekStart} to ${input.weekEnd}
${input.preferences ? `Preferences: ${input.preferences}` : ""}

Rules:
- Assign age-appropriate tasks (children get simple tasks, teens moderate, adults any)
- Distribute tasks fairly across the week (Sunday=0 through Saturday=6)
- Include common household chores: cleaning, laundry, dishes, cooking, vacuuming, trash, yard work, etc.
- Set priority: "high" for daily essentials, "medium" for regular tasks, "low" for optional tasks
- Each member should have 2-4 tasks per day
- Use the member's exact name in assigneeName

Respond with JSON matching this schema:
{
  "tasks": [
    {
      "title": "string",
      "description": "string (optional)",
      "dayOfWeek": 0-6,
      "priority": "low" | "medium" | "high",
      "assigneeName": "string (optional, exact member name)"
    }
  ]
}`;
}
