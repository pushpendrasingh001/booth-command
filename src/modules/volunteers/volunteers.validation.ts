import { z } from "zod";

export const createVolunteerSchema = z.object({
  name: z.string().min(2).max(100).trim(),
  mobile: z.string().regex(/^[6-9]\d{9}$/, "Invalid mobile number"),
});

export const updateVolunteerSchema = z.object({
  name: z.string().min(2).max(100).trim().optional(),
  mobile: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Invalid mobile number")
    .optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
});

export const assignBoothSchema = z.object({
  boothId: z.string().uuid(),
});

export type CreateVolunteerInput =
  z.infer<typeof createVolunteerSchema>;

export type UpdateVolunteerInput =
  z.infer<typeof updateVolunteerSchema>;

export type AssignBoothInput =
  z.infer<typeof assignBoothSchema>;