import { z } from "zod";

export const aiChoreTaskSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  dayOfWeek: z.number().int().min(0).max(6),
  priority: z.enum(["low", "medium", "high"]),
  assigneeName: z.string().optional(),
});

export const aiChoreScheduleSchema = z.object({
  tasks: z.array(aiChoreTaskSchema),
});

export const aiMealSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  mealType: z.enum(["breakfast", "lunch", "dinner", "snack"]),
  dayOfWeek: z.number().int().min(0).max(6),
  calories: z.number().int().optional(),
  prepTime: z.number().int().optional(),
  ingredients: z.string().optional(),
});

export const aiMealPlanSchema = z.object({
  meals: z.array(aiMealSchema),
});

export type AIChoreTask = z.infer<typeof aiChoreTaskSchema>;
export type AIChoreSchedule = z.infer<typeof aiChoreScheduleSchema>;
export type AIMeal = z.infer<typeof aiMealSchema>;
export type AIMealPlan = z.infer<typeof aiMealPlanSchema>;
