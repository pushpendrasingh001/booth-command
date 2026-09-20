import { z } from "zod";

export const userListSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),

  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(100)
    .default(20),

  search: z.string().trim().optional(),

  status: z
    .enum(["ACTIVE", "INACTIVE"])
    .optional(),
});

export type UserListInput = z.infer<
  typeof userListSchema
>;

export const updateUserSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2)
    .max(100)
    .optional(),

  email: z
    .string()
    .trim()
    .email()
    .optional(),
});

export type UpdateUserInput = z.infer<
  typeof updateUserSchema
>;

export const updateStatusSchema = z.object({
  status: z.enum([
    "ACTIVE",
    "INACTIVE",
  ]),
});

export type UpdateStatusInput = z.infer<
  typeof updateStatusSchema
>;

export const updatePasswordSchema = z.object({
  newPassword: z
    .string()
    .min(8)
    .max(100),
});

export type UpdatePasswordInput = z.infer<
  typeof updatePasswordSchema
>;