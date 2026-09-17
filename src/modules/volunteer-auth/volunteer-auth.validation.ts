import { z } from "zod";

export const volunteerLoginSchema = z.object({
  idToken: z.string().min(1, "Firebase ID token is required"),
});

export type VolunteerLoginInput =
  z.infer<typeof volunteerLoginSchema>;