import { prisma } from "../../config/prisma";
import {
  CreateVolunteerInput,
  UpdateVolunteerInput,
} from "./volunteers.validation";

// Create Volunteer
export async function createVolunteer(
  input: CreateVolunteerInput
) {
  const existing = await prisma.volunteer.findUnique({
    where: {
      mobile: input.mobile,
    },
  });

  if (existing) {
    throw new Error(
      "Volunteer with this mobile already exists"
    );
  }

  return prisma.volunteer.create({
    data: {
      name: input.name,
      mobile: input.mobile,
    },
  });
}

// Get All Volunteers
export async function getVolunteers() {
  return prisma.volunteer.findMany({
    orderBy: {
      createdAt: "desc",
    },

    include: {
      booth: {
        select: {
          id: true,
          boothNumber: true,
          name: true,
          village: true,
          assemblyId: true,
        },
      },
    },
  });
}

// Get Volunteer By ID
export async function getVolunteerById(id: string) {
  const volunteer = await prisma.volunteer.findUnique({
    where: {
      id,
    },

    include: {
      booth: {
        select: {
          id: true,
          boothNumber: true,
          name: true,
          village: true,
          assemblyId: true,
        },
      },
    },
  });

  if (!volunteer) {
    throw new Error("Volunteer not found");
  }

  return volunteer;
}

// Update Volunteer
export async function updateVolunteer(
  id: string,
  input: UpdateVolunteerInput
) {
  const existing = await prisma.volunteer.findUnique({
    where: {
      id,
    },
  });

  if (!existing) {
    throw new Error("Volunteer not found");
  }

  if (input.mobile) {
    const mobileExists = await prisma.volunteer.findFirst({
      where: {
        mobile: input.mobile,
        NOT: {
          id,
        },
      },
    });

    if (mobileExists) {
      throw new Error(
        "Volunteer with this mobile already exists"
      );
    }
  }

  return prisma.volunteer.update({
    where: {
      id,
    },

    data: input,

    include: {
      booth: {
        select: {
          id: true,
          boothNumber: true,
          name: true,
          village: true,
          assemblyId: true,
        },
      },
    },
  });
}

// Assign Booth To Volunteer
export async function assignBooth(
  volunteerId: string,
  boothId: string
) {
  // 1. Check volunteer exists
  const volunteer = await prisma.volunteer.findUnique({
    where: {
      id: volunteerId,
    },
  });

  if (!volunteer) {
    throw new Error("Volunteer not found");
  }

  // 2. Check booth exists
  const booth = await prisma.booth.findUnique({
    where: {
      id: boothId,
    },
  });

  if (!booth) {
    throw new Error("Booth not found");
  }

  // 3. Check whether booth is already assigned
  if (
    booth.volunteerId &&
    booth.volunteerId !== volunteerId
  ) {
    throw new Error(
      "This booth is already assigned to another volunteer"
    );
  }

  // 4. Check whether volunteer already has another booth
  const existingAssignment = await prisma.booth.findFirst({
    where: {
      volunteerId,
      NOT: {
        id: boothId,
      },
    },
  });

  if (existingAssignment) {
    throw new Error(
      `This volunteer is already assigned to booth ${existingAssignment.boothNumber}`
    );
  }

  // 5. Assign booth
  const updatedBooth = await prisma.booth.update({
    where: {
      id: boothId,
    },

    data: {
      volunteerId,
    },

    include: {
      volunteer: {
        select: {
          id: true,
          name: true,
          mobile: true,
          status: true,
        },
      },

      assembly: {
        select: {
          id: true,
          number: true,
          name: true,
          district: true,
        },
      },
    },
  });

  return updatedBooth;
}