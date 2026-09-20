import { prisma } from "../../config/prisma.js";
import type {
  UpdateSettingsInput,
} from "./settings.validation.js";

const DEFAULT_SETTINGS = {
  strongGreenPercent: 55,
  moderateGreenPercent: 40,

  highOpportunityYellow: 15,
  mediumOpportunityYellow: 8,

  highVerification: 80,
  mediumVerification: 50,
};

/**
 * Get current system settings.
 *
 * There should be only one settings row.
 */
export async function getSettings() {
  let settings =
    await prisma.systemSettings.findFirst();

  if (!settings) {
    settings =
      await prisma.systemSettings.create({
        data: DEFAULT_SETTINGS,
      });
  }

  return settings;
}

/**
 * Update system settings.
 */
export async function updateSettings(
  input: UpdateSettingsInput,
  changedByUserId: string
) {
  const current =
    await getSettings();

  const updated =
    await prisma.systemSettings.update({
      where: {
        id: current.id,
      },

      data: {
        ...(input.strongGreenPercent !==
          undefined && {
          strongGreenPercent:
            input.strongGreenPercent,
        }),

        ...(input.moderateGreenPercent !==
          undefined && {
          moderateGreenPercent:
            input.moderateGreenPercent,
        }),

        ...(input.highOpportunityYellow !==
          undefined && {
          highOpportunityYellow:
            input.highOpportunityYellow,
        }),

        ...(input.mediumOpportunityYellow !==
          undefined && {
          mediumOpportunityYellow:
            input.mediumOpportunityYellow,
        }),

        ...(input.highVerification !==
          undefined && {
          highVerification:
            input.highVerification,
        }),

        ...(input.mediumVerification !==
          undefined && {
          mediumVerification:
            input.mediumVerification,
        }),
      },
    });

  await prisma.auditLog.create({
    data: {
      action: "SYSTEM_SETTINGS_UPDATED",

      entity: "SYSTEM_SETTINGS",

      entityId: updated.id,

      userId: changedByUserId,

      details: {
        oldValues: {
          strongGreenPercent:
            current.strongGreenPercent,

          moderateGreenPercent:
            current.moderateGreenPercent,

          highOpportunityYellow:
            current.highOpportunityYellow,

          mediumOpportunityYellow:
            current.mediumOpportunityYellow,

          highVerification:
            current.highVerification,

          mediumVerification:
            current.mediumVerification,
        },

        newValues: {
          strongGreenPercent:
            updated.strongGreenPercent,

          moderateGreenPercent:
            updated.moderateGreenPercent,

          highOpportunityYellow:
            updated.highOpportunityYellow,

          mediumOpportunityYellow:
            updated.mediumOpportunityYellow,

          highVerification:
            updated.highVerification,

          mediumVerification:
            updated.mediumVerification,
        },
      },
    },
  });

  return updated;
}