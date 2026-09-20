import { z } from "zod";

/**
 * Create volunteer
 */
export const createVolunteerSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100)
    .trim(),

  mobile: z
    .string()
    .regex(
      /^[6-9]\d{9}$/,
      "Invalid Indian mobile number"
    ),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(128, "Password too long"),
});

/**
 * Update volunteer
 */
export const updateVolunteerSchema = z.object({
  name: z
    .string()
    .min(2)
    .max(100)
    .trim()
    .optional(),

  mobile: z
    .string()
    .regex(
      /^[6-9]\d{9}$/,
      "Invalid Indian mobile number"
    )
    .optional(),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(128, "Password too long")
    .optional(),

  status: z
    .enum(["ACTIVE", "INACTIVE"])
    .optional(),
});

/**
 * Assign booth
 */
export const assignBoothSchema = z.object({
  boothId: z.string().uuid(),
});

export type CreateVolunteerInput =
  z.infer<typeof createVolunteerSchema>;

export type UpdateVolunteerInput =
  z.infer<typeof updateVolunteerSchema>;

export type AssignBoothInput =
  z.infer<typeof assignBoothSchema>;