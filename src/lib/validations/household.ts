import { z } from "zod";

export const createMemberSchema = z.object({
  name: z.string().min(1, "Name is required").max(50),
  avatar: z.string().optional(),
  age: z.number().int().min(0).max(120).optional(),
  role: z.enum(["adult", "teen", "child"]),
});

export const updateMemberSchema = createMemberSchema.partial();

export type CreateMemberInput = z.infer<typeof createMemberSchema>;
export type UpdateMemberInput = z.infer<typeof updateMemberSchema>;
