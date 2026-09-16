import { prisma } from "../../config/prisma";
import {
  CreateAssemblyInput,
  UpdateAssemblyInput,
} from "./assembly.validation";

export async function createAssembly(input: CreateAssemblyInput) {
  const existing = await prisma.assembly.findFirst({
    where: {
      number: input.number,
      electionYear: input.electionYear,
    },
  });

  if (existing) {
    throw new Error(
      "Assembly with this number already exists for this election year"
    );
  }

  return prisma.assembly.create({
    data: input,
  });
}

export async function getAssemblies() {
  return prisma.assembly.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      _count: {
        select: {
          booths: true,
          voters: true,
        },
      },
    },
  });
}

export async function getAssemblyById(id: string) {
  const assembly = await prisma.assembly.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          booths: true,
          voters: true,
        },
      },
    },
  });

  if (!assembly) {
    throw new Error("Assembly not found");
  }

  return assembly;
}

export async function updateAssembly(
  id: string,
  input: UpdateAssemblyInput
) {
  const existing = await prisma.assembly.findUnique({
    where: { id },
  });

  if (!existing) {
    throw new Error("Assembly not found");
  }

  return prisma.assembly.update({
    where: { id },
    data: input,
  });
}