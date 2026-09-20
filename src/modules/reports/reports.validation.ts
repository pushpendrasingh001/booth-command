import { z } from "zod";

export const reportFilterSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),

  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(100)
    .default(20),

  search: z.string().trim().optional(),

  boothId: z.string().trim().optional(),

  classification: z
    .enum(["GREEN", "YELLOW", "RED", "BLACK"])
    .optional(),

  verification: z
    .enum(["VERIFIED", "UNVERIFIED"])
    .optional(),

  voteStatus: z
    .enum(["PENDING", "DONE"])
    .optional(),

  gender: z.string().trim().optional(),

  ageFrom: z.coerce.number().int().min(0).optional(),

  ageTo: z.coerce.number().int().min(0).optional(),
});

export type ReportFilterInput = z.infer<
  typeof reportFilterSchema
>;

export const exportFormatSchema = z.object({
  format: z
    .enum(["csv", "xlsx"])
    .default("xlsx"),
});

export type ExportFormatInput = z.infer<
  typeof exportFormatSchema
>;