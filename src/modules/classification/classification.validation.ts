import { z } from "zod";

export const classificationFilterSchema =
  z.object({
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

    classification: z
      .enum([
        "GREEN",
        "YELLOW",
        "RED",
        "BLACK",
      ])
      .optional(),

    verification: z
      .enum([
        "VERIFIED",
        "UNVERIFIED",
      ])
      .optional(),

    voteStatus: z
      .enum([
        "PENDING",
        "DONE",
      ])
      .optional(),

    boothId: z
      .string()
      .uuid()
      .optional(),
  });

export const updateClassificationSchema =
  z.object({
    classification: z
      .enum([
        "GREEN",
        "YELLOW",
        "RED",
        "BLACK",
      ])
      .optional(),

    verification: z
      .enum([
        "VERIFIED",
        "UNVERIFIED",
      ])
      .optional(),

    voteStatus: z
      .enum([
        "PENDING",
        "DONE",
      ])
      .optional(),
  })
  .refine(
    (data) =>
      data.classification !== undefined ||
      data.verification !== undefined ||
      data.voteStatus !== undefined,
    {
      message:
        "At least one field is required",
    }
  );

export const bulkClassificationSchema =
  z.object({
    voterIds: z
      .array(z.string().uuid())
      .min(1)
      .max(1000),

    classification: z.enum([
      "GREEN",
      "YELLOW",
      "RED",
      "BLACK",
    ]),
  });

export type ClassificationFilterInput =
  z.infer<
    typeof classificationFilterSchema
  >;

export type UpdateClassificationInput =
  z.infer<
    typeof updateClassificationSchema
  >;

export type BulkClassificationInput =
  z.infer<
    typeof bulkClassificationSchema
  >;