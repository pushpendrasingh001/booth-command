import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(2).max(100).trim(),
  email: z.string().email().trim().toLowerCase(),
  password: z.string().min(6),
});

export const updateUserSchema = z.object({
  name: z.string().min(2).max(100).trim().optional(),
  email: z.string().email().trim().toLowerCase().optional(),
  password: z.string().min(6).optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;