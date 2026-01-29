import { z } from "zod";

export const createMealPlanSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  weekStart: z.string().min(1, "Week start is required"),
  weekEnd: z.string().min(1, "Week end is required"),
  status: z.enum(["draft", "active", "completed"]).default("draft"),
  servings: z.number().int().min(1).max(20).default(4),
});

export const updateMealPlanSchema = createMealPlanSchema.partial();

export const createMealSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().max(500).optional(),
  mealType: z.enum(["breakfast", "lunch", "dinner", "snack"]),
  dayOfWeek: z.number().int().min(0).max(6),
  calories: z.number().int().min(0).optional(),
  prepTime: z.number().int().min(0).optional(),
  ingredients: z.string().optional(),
  planId: z.string().min(1),
});

export const updateMealSchema = createMealSchema.partial();

export type CreateMealPlanInput = z.infer<typeof createMealPlanSchema>;
export type UpdateMealPlanInput = z.infer<typeof updateMealPlanSchema>;
export type CreateMealInput = z.infer<typeof createMealSchema>;
export type UpdateMealInput = z.infer<typeof updateMealSchema>;
