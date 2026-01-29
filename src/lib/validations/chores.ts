import { z } from "zod";

export const createChoreScheduleSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  weekStart: z.string().min(1, "Week start is required"),
  weekEnd: z.string().min(1, "Week end is required"),
  status: z.enum(["draft", "active", "completed"]).default("draft"),
});

export const updateChoreScheduleSchema = createChoreScheduleSchema.partial();

export const createChoreTaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().max(500).optional(),
  dayOfWeek: z.number().int().min(0).max(6),
  isCompleted: z.boolean().default(false),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  scheduleId: z.string().min(1),
  assigneeId: z.string().optional().nullable(),
});

export const updateChoreTaskSchema = createChoreTaskSchema.partial();

export type CreateChoreScheduleInput = z.infer<typeof createChoreScheduleSchema>;
export type UpdateChoreScheduleInput = z.infer<typeof updateChoreScheduleSchema>;
export type CreateChoreTaskInput = z.infer<typeof createChoreTaskSchema>;
export type UpdateChoreTaskInput = z.infer<typeof updateChoreTaskSchema>;
