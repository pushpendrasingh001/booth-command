import { z } from "zod";

export const analyticsBoothFilterSchema = z.object({
  page: z.coerce
    .number()
    .int()
    .min(1)
    .default(1),

  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(100)
    .default(20),

  search: z
    .string()
    .trim()
    .optional(),
});

export type AnalyticsBoothFilterInput =
  z.infer<typeof analyticsBoothFilterSchema>;