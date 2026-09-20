import { z } from "zod";

const percentage = z.coerce
  .number()
  .min(0)
  .max(100);

export const updateSettingsSchema = z
  .object({
    strongGreenPercent: percentage.optional(),

    moderateGreenPercent: percentage.optional(),

    highOpportunityYellow: percentage.optional(),

    mediumOpportunityYellow: percentage.optional(),

    highVerification: percentage.optional(),

    mediumVerification: percentage.optional(),
  })
  .superRefine((data, ctx) => {
    if (
      data.strongGreenPercent !== undefined &&
      data.moderateGreenPercent !== undefined &&
      data.strongGreenPercent <
        data.moderateGreenPercent
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["strongGreenPercent"],
        message:
          "Strong Green percentage must be greater than or equal to Moderate Green percentage",
      });
    }

    if (
      data.highOpportunityYellow !== undefined &&
      data.mediumOpportunityYellow !== undefined &&
      data.highOpportunityYellow <
        data.mediumOpportunityYellow
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["highOpportunityYellow"],
        message:
          "High Yellow opportunity must be greater than or equal to Medium Yellow opportunity",
      });
    }

    if (
      data.highVerification !== undefined &&
      data.mediumVerification !== undefined &&
      data.highVerification <
        data.mediumVerification
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["highVerification"],
        message:
          "High Verification must be greater than or equal to Medium Verification",
      });
    }
  });

export type UpdateSettingsInput =
  z.infer<typeof updateSettingsSchema>;