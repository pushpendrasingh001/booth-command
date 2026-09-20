import { prisma } from "../../config/prisma.js";
import {
  getSingleActiveAssembly,
} from "../../utils/single-assembly.js";

import {
  BoothAnalysisFilterInput,
} from "./booth-analysis.validation.js";

// ========================================
// TYPES
// ========================================

type GreenStrength =
  | "STRONG"
  | "MODERATE"
  | "WEAK";

type YellowOpportunity =
  | "HIGH"
  | "MEDIUM"
  | "LOW";

type DataConfidence =
  | "HIGH"
  | "MEDIUM"
  | "LOW";

// ========================================
// HELPERS
// ========================================

function percentage(
  value: number,
  total: number
): number {
  if (total === 0) {
    return 0;
  }

  return Number(
    ((value / total) * 100).toFixed(2)
  );
}

// ========================================
// SETTINGS
// ========================================

async function getSettings() {
  const settings =
    await prisma.systemSettings.findFirst({
      orderBy: {
        createdAt: "asc",
      },
    });

  return {
    strongGreenPercent:
      settings?.strongGreenPercent ?? 55,

    moderateGreenPercent:
      settings?.moderateGreenPercent ?? 40,

    highOpportunityYellow:
      settings?.highOpportunityYellow ?? 15,

    mediumOpportunityYellow:
      settings?.mediumOpportunityYellow ?? 8,

    highVerification:
      settings?.highVerification ?? 80,

    mediumVerification:
      settings?.mediumVerification ?? 50,
  };
}

// ========================================
// CLASSIFICATION LEVEL
// ========================================

function getGreenStrength(
  greenPercentage: number,
  settings: Awaited<
    ReturnType<typeof getSettings>
  >
): GreenStrength {
  if (
    greenPercentage >=
    settings.strongGreenPercent
  ) {
    return "STRONG";
  }

  if (
    greenPercentage >=
    settings.moderateGreenPercent
  ) {
    return "MODERATE";
  }

  return "WEAK";
}

// ========================================
// YELLOW OPPORTUNITY
// ========================================

function getYellowOpportunity(
  yellowPercentage: number,
  settings: Awaited<
    ReturnType<typeof getSettings>
  >
): YellowOpportunity {
  if (
    yellowPercentage >=
    settings.highOpportunityYellow
  ) {
    return "HIGH";
  }

  if (
    yellowPercentage >=
    settings.mediumOpportunityYellow
  ) {
    return "MEDIUM";
  }

  return "LOW";
}

// ========================================
// DATA CONFIDENCE
// ========================================

function getDataConfidence(
  verificationPercentage: number,
  settings: Awaited<
    ReturnType<typeof getSettings>
  >
): DataConfidence {
  if (
    verificationPercentage >=
    settings.highVerification
  ) {
    return "HIGH";
  }

  if (
    verificationPercentage >=
    settings.mediumVerification
  ) {
    return "MEDIUM";
  }

  return "LOW";
}

// ========================================
// CALCULATE BOOTH
// ========================================

async function calculateBoothAnalytics(
  boothId: string,
  settings: Awaited<
    ReturnType<typeof getSettings>
  >
) {
  const booth =
    await prisma.booth.findUnique({
      where: {
        id: boothId,
      },

      select: {
        id: true,

        boothNumber: true,

        name: true,

        village: true,

        volunteer: {
          select: {
            id: true,
            name: true,
            mobile: true,
            status: true,
          },
        },

        _count: {
          select: {
            voters: true,
          },
        },
      },
    });

  if (!booth) {
    return null;
  }

  const [
    green,
    yellow,
    red,
    black,
    unclassified,
    verified,
    unverified,
  ] = await Promise.all([
    prisma.voter.count({
      where: {
        boothId: booth.id,
        classification: "GREEN",
      },
    }),

    prisma.voter.count({
      where: {
        boothId: booth.id,
        classification: "YELLOW",
      },
    }),

    prisma.voter.count({
      where: {
        boothId: booth.id,
        classification: "RED",
      },
    }),

    prisma.voter.count({
      where: {
        boothId: booth.id,
        classification: "BLACK",
      },
    }),

    prisma.voter.count({
      where: {
        boothId: booth.id,
        classification: null,
      },
    }),

    prisma.voter.count({
      where: {
        boothId: booth.id,
        verification: "VERIFIED",
      },
    }),

    prisma.voter.count({
      where: {
        boothId: booth.id,
        verification: "UNVERIFIED",
      },
    }),
  ]);

  const totalVoters =
    booth._count.voters;

  const greenPercentage =
    percentage(
      green,
      totalVoters
    );

  const yellowPercentage =
    percentage(
      yellow,
      totalVoters
    );

  const redPercentage =
    percentage(
      red,
      totalVoters
    );

  const blackPercentage =
    percentage(
      black,
      totalVoters
    );

  const unclassifiedPercentage =
    percentage(
      unclassified,
      totalVoters
    );

  const verificationPercentage =
    percentage(
      verified,
      totalVoters
    );

  return {
    booth: {
      id: booth.id,

      boothNumber:
        booth.boothNumber,

      name: booth.name,

      village:
        booth.village,

      volunteer:
        booth.volunteer,
    },

    voters: {
      total: totalVoters,

      green,
      yellow,
      red,
      black,

      unclassified,

      verified,
      unverified,
    },

    percentages: {
      green: greenPercentage,

      yellow: yellowPercentage,

      red: redPercentage,

      black: blackPercentage,

      unclassified:
        unclassifiedPercentage,

      verified:
        verificationPercentage,

      unverified:
        percentage(
          unverified,
          totalVoters
        ),
    },

    analysis: {
      greenStrength:
        getGreenStrength(
          greenPercentage,
          settings
        ),

      yellowOpportunity:
        getYellowOpportunity(
          yellowPercentage,
          settings
        ),

      dataConfidence:
        getDataConfidence(
          verificationPercentage,
          settings
        ),
    },
  };
}

// ========================================
// COMMON BOOTH QUERY
// ========================================

async function getAllBoothAnalytics(
  input: BoothAnalysisFilterInput
) {
  const assembly =
    await getSingleActiveAssembly();

  const settings =
    await getSettings();

  const {
    page,
    limit,
    search,
  } = input;

  const skip =
    (page - 1) * limit;

  const where = {
    assemblyId: assembly.id,

    ...(search
      ? {
          OR: [
            {
              boothNumber: {
                contains: search,
                mode: "insensitive" as const,
              },
            },

            {
              name: {
                contains: search,
                mode: "insensitive" as const,
              },
            },

            {
              village: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
          ],
        }
      : {}),
  };

  const [
    booths,
    total,
  ] = await Promise.all([
    prisma.booth.findMany({
      where,

      skip,

      take: limit,

      orderBy: {
        boothNumber: "asc",
      },

      select: {
        id: true,
      },
    }),

    prisma.booth.count({
      where,
    }),
  ]);

  const analytics =
    await Promise.all(
      booths.map(
        (booth) =>
          calculateBoothAnalytics(
            booth.id,
            settings
          )
      )
    );

  return {
    assembly,

    booths: analytics.filter(
      (
        booth
      ): booth is NonNullable<
        typeof booth
      > => booth !== null
    ),

    pagination: {
      page,

      limit,

      total,

      totalPages:
        Math.ceil(
          total / limit
        ),
    },

    thresholds: {
      strongGreenPercent:
        settings.strongGreenPercent,

      moderateGreenPercent:
        settings.moderateGreenPercent,

      highOpportunityYellow:
        settings.highOpportunityYellow,

      mediumOpportunityYellow:
        settings.mediumOpportunityYellow,

      highVerification:
        settings.highVerification,

      mediumVerification:
        settings.mediumVerification,
    },
  };
}

// ========================================
// STRONG BOOTHS
// ========================================

export async function getStrongBooths(
  input: BoothAnalysisFilterInput
) {
  const result =
    await getAllBoothAnalytics(
      input
    );

  return {
    ...result,

    booths:
      result.booths.filter(
        (booth) =>
          booth.analysis
            .greenStrength ===
          "STRONG"
      ),
  };
}

// ========================================
// WEAK BOOTHS
// ========================================

export async function getWeakBooths(
  input: BoothAnalysisFilterInput
) {
  const result =
    await getAllBoothAnalytics(
      input
    );

  return {
    ...result,

    booths:
      result.booths.filter(
        (booth) =>
          booth.analysis
            .greenStrength ===
          "WEAK"
      ),
  };
}

// ========================================
// OPPORTUNITY BOOTHS
// ========================================

export async function getOpportunityBooths(
  input: BoothAnalysisFilterInput
) {
  const result =
    await getAllBoothAnalytics(
      input
    );

  return {
    ...result,

    booths:
      result.booths.filter(
        (booth) =>
          booth.analysis
            .yellowOpportunity ===
          "HIGH"
      ),
  };
}

// ========================================
// CONFIDENCE BOOTHS
// ========================================

export async function getConfidenceBooths(
  input: BoothAnalysisFilterInput
) {
  const result =
    await getAllBoothAnalytics(
      input
    );

  return {
    ...result,

    booths:
      result.booths.filter(
        (booth) =>
          booth.analysis
            .dataConfidence ===
          "HIGH"
      ),
  };
}

// ========================================
// SINGLE BOOTH ANALYSIS
// ========================================

export async function getBoothAnalysis(
  boothId: string
) {
  const assembly =
    await getSingleActiveAssembly();

  const settings =
    await getSettings();

  const booth =
    await prisma.booth.findFirst({
      where: {
        id: boothId,

        assemblyId:
          assembly.id,
      },

      select: {
        id: true,
      },
    });

  if (!booth) {
    throw new Error(
      "Booth not found in active assembly"
    );
  }

  const result =
    await calculateBoothAnalytics(
      booth.id,
      settings
    );

  if (!result) {
    throw new Error(
      "Unable to calculate booth analytics"
    );
  }

  return {
    assembly,

    ...result,

    thresholds: {
      strongGreenPercent:
        settings.strongGreenPercent,

      moderateGreenPercent:
        settings.moderateGreenPercent,

      highOpportunityYellow:
        settings.highOpportunityYellow,

      mediumOpportunityYellow:
        settings.mediumOpportunityYellow,

      highVerification:
        settings.highVerification,

      mediumVerification:
        settings.mediumVerification,
    },
  };
}