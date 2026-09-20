import { z } from "zod";

/**
 * Volunteer login — Mobile + Password
 */
export const volunteerLoginSchema = z.object({
  mobile: z
    .string()
    .regex(
      /^[6-9]\d{9}$/,
      "Invalid Indian mobile number"
    ),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
});

export type VolunteerLoginInput =
  z.infer<typeof volunteerLoginSchema>;