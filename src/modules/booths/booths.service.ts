import { prisma } from "../../config/prisma";
import {
  CreateBoothInput,
  UpdateBoothInput,
} from "./booths.validation";

export async function createBooth(input: CreateBoothInput) {
  // Check assembly
  const assembly = await prisma.assembly.findUnique({
    where: {
      id: input.assemblyId,
    },
  });

  if (!assembly) {
    throw new Error("Assembly not found");
  }

  // Check duplicate booth number inside assembly
  const existingBooth = await prisma.booth.findUnique({
    where: {
      assemblyId_boothNumber: {
        assemblyId: input.assemblyId,
        boothNumber: input.boothNumber,
      },
    },
  });

  if (existingBooth) {
    throw new Error(
      "Booth with this number already exists in this assembly"
    );
  }

  return prisma.booth.create({
    data: {
      boothNumber: input.boothNumber,
      name: input.name,
      village: input.village,
      assemblyId: input.assemblyId,
    },
    include: {
      assembly: true,
      _count: {
        select: {
          voters: true,
        },
      },
    },
  });
}

export async function getBooths(assemblyId?: string) {
  return prisma.booth.findMany({
    where: assemblyId
      ? {
          assemblyId,
        }
      : undefined,

    orderBy: {
      boothNumber: "asc",
    },

    include: {
      assembly: {
        select: {
          id: true,
          number: true,
          name: true,
          district: true,
        },
      },

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
}

export async function getBoothById(id: string) {
  const booth = await prisma.booth.findUnique({
    where: {
      id,
    },

    include: {
      assembly: true,

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
    throw new Error("Booth not found");
  }

  return booth;
}

export async function updateBooth(
  id: string,
  input: UpdateBoothInput
) {
  const existingBooth = await prisma.booth.findUnique({
    where: {
      id,
    },
  });

  if (!existingBooth) {
    throw new Error("Booth not found");
  }

  // If booth number is being changed,
  // make sure it doesn't conflict.
  if (input.boothNumber) {
    const duplicate = await prisma.booth.findFirst({
      where: {
        assemblyId: existingBooth.assemblyId,
        boothNumber: input.boothNumber,
        NOT: {
          id,
        },
      },
    });

    if (duplicate) {
      throw new Error(
        "Booth with this number already exists in this assembly"
      );
    }
  }

  return prisma.booth.update({
    where: {
      id,
    },

    data: input,

    include: {
      assembly: true,

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
}