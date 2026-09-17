import { z } from "zod";

export const voterFilterSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().trim().optional(),
  classification: z
    .enum(["GREEN", "YELLOW", "RED", "BLACK"])
    .optional(),
  verification: z
    .enum(["VERIFIED", "UNVERIFIED"])
    .optional(),
  voteStatus: z
    .enum(["PENDING", "DONE"])
    .optional(),
});

export const updateVoterSchema = z.object({
  classification: z
    .enum(["GREEN", "YELLOW", "RED", "BLACK"])
    .optional(),

  verification: z
    .enum(["VERIFIED", "UNVERIFIED"])
    .optional(),

  voteStatus: z
    .enum(["PENDING", "DONE"])
    .optional(),
});

export type VoterFilterInput = z.infer<typeof voterFilterSchema>;
export type UpdateVoterInput = z.infer<typeof updateVoterSchema>;