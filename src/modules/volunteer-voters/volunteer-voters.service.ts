import { prisma } from "../../config/prisma";
import {
  UpdateVoterInput,
  VoterFilterInput,
} from "./volunteer-voters.validation";

export async function getMyBoothVoters(
  volunteerId: string,
  input: VoterFilterInput
) {
  const volunteer = await prisma.volunteer.findUnique({
    where: { id: volunteerId },
    select: {
      id: true,
      booth: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!volunteer) {
    throw new Error("Volunteer not found");
  }

  if (!volunteer.booth) {
    throw new Error("No booth is assigned to this volunteer");
  }

  const { page, limit, search, classification, verification, voteStatus } =
    input;

  const skip = (page - 1) * limit;

  const where = {
    boothId: volunteer.booth.id,

    ...(classification && {
      classification,
    }),

    ...(verification && {
      verification,
    }),

    ...(voteStatus && {
      voteStatus,
    }),

    ...(search && {
      OR: [
        {
          name: {
            contains: search,
            mode: "insensitive" as const,
          },
        },
        {
          epic: {
            contains: search,
            mode: "insensitive" as const,
          },
        },
        {
          mobile: {
            contains: search,
          },
        },
        {
          houseNumber: {
            contains: search,
            mode: "insensitive" as const,
          },
        },
      ],
    }),
  };

  const [voters, total] = await Promise.all([
    prisma.voter.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        name: "asc",
      },
    }),

    prisma.voter.count({
      where,
    }),
  ]);

  return {
    voters,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}
export async function updateMyBoothVoter(
  volunteerId: string,
  voterId: string,
  input: UpdateVoterInput
) {
  const volunteer = await prisma.volunteer.findUnique({
    where: { id: volunteerId },
    select: {
      booth: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!volunteer) {
    throw new Error("Volunteer not found");
  }

  if (!volunteer.booth) {
    throw new Error("No booth is assigned to this volunteer");
  }

  const voter = await prisma.voter.findFirst({
    where: {
      id: voterId,
      boothId: volunteer.booth.id,
    },
  });

  if (!voter) {
    throw new Error("Voter not found in your assigned booth");
  }

  const updatedVoter = await prisma.voter.update({
    where: {
      id: voterId,
    },
    data: input,
  });

  if (input.classification !== undefined) {
    await prisma.classificationHistory.create({
      data: {
        voterId,
        oldValue: voter.classification,
        newValue: input.classification,
        changedById: volunteerId,
      },
    });
  }

  return updatedVoter;
}