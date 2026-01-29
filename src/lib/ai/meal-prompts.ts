interface MealPromptInput {
  servings: number;
  weekStart: string;
  weekEnd: string;
  dietaryRestrictions?: string;
  cuisinePreferences?: string;
}

export function buildMealPrompt(input: MealPromptInput): string {
  return `Generate a weekly meal plan for ${input.servings} servings per meal.

Week: ${input.weekStart} to ${input.weekEnd}
${input.dietaryRestrictions ? `Dietary restrictions: ${input.dietaryRestrictions}` : ""}
${input.cuisinePreferences ? `Cuisine preferences: ${input.cuisinePreferences}` : ""}

Rules:
- Include breakfast, lunch, and dinner for each day (Sunday=0 through Saturday=6)
- Add 1-2 snacks per day
- Provide estimated calories and prep time in minutes
- List main ingredients as a comma-separated string
- Meals should be varied, balanced, and practical for home cooking
- Consider using overlapping ingredients across meals to reduce waste

Respond with JSON matching this schema:
{
  "meals": [
    {
      "name": "string",
      "description": "string (optional, brief description)",
      "mealType": "breakfast" | "lunch" | "dinner" | "snack",
      "dayOfWeek": 0-6,
      "calories": number (optional),
      "prepTime": number (optional, minutes),
      "ingredients": "string (optional, comma-separated)"
    }
  ]
}`;
}
