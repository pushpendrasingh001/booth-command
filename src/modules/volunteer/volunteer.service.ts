import { prisma } from "../../config/prisma";

import {
  CreateVolunteerInput,
  UpdateVolunteerInput,
} from "./volunteer.validation";

/**
 * Common booth response
 */
const boothSelect = {
  id: true,
  boothNumber: true,
  name: true,
  village: true,
  assemblyId: true,
};

/**
 * Create volunteer
 */
export async function createVolunteer(
  input: CreateVolunteerInput,
  adminUserId: string
) {
  /**
   * Check duplicate mobile
   */
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

  const volunteer =
    await prisma.volunteer.create({
      data: {
        name: input.name,
        mobile: input.mobile,
      },

      include: {
        booth: {
          select: boothSelect,
        },
      },
    });

  /**
   * Audit log
   */
  await prisma.auditLog.create({
    data: {
      action: "VOLUNTEER_CREATED",

      entity: "VOLUNTEER",

      entityId: volunteer.id,

      userId: adminUserId,

      volunteerId: volunteer.id,

      details: {
        name: volunteer.name,
        mobile: volunteer.mobile,
      },
    },
  });

  return volunteer;
}

/**
 * Get all volunteers
 */
export async function getVolunteers() {
  return prisma.volunteer.findMany({
    orderBy: {
      createdAt: "desc",
    },

    include: {
      booth: {
        select: boothSelect,
      },
    },
  });
}

/**
 * Get volunteer by ID
 */
export async function getVolunteerById(
  id: string
) {
  const volunteer =
    await prisma.volunteer.findUnique({
      where: {
        id,
      },

      include: {
        booth: {
          select: boothSelect,
        },
      },
    });

  if (!volunteer) {
    throw new Error(
      "Volunteer not found"
    );
  }

  return volunteer;
}

/**
 * Update volunteer
 */
export async function updateVolunteer(
  id: string,
  input: UpdateVolunteerInput,
  adminUserId: string
) {
  /**
   * Check volunteer
   */
  const existing =
    await prisma.volunteer.findUnique({
      where: {
        id,
      },
    });

  if (!existing) {
    throw new Error(
      "Volunteer not found"
    );
  }

  /**
   * Check duplicate mobile
   */
  if (input.mobile) {
    const mobileExists =
      await prisma.volunteer.findFirst({
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

  const updatedVolunteer =
    await prisma.volunteer.update({
      where: {
        id,
      },

      data: input,

      include: {
        booth: {
          select: boothSelect,
        },
      },
    });

  /**
   * Audit log
   */
  await prisma.auditLog.create({
    data: {
      action: "VOLUNTEER_UPDATED",

      entity: "VOLUNTEER",

      entityId: id,

      userId: adminUserId,

      volunteerId: id,

      details: JSON.parse(
        JSON.stringify(input)
      ),
    },
  });

  return updatedVolunteer;
}

/**
 * Assign booth to volunteer
 *
 * Rules:
 *
 * 1 volunteer = maximum 1 booth
 *
 * 1 booth = maximum 1 volunteer
 */
export async function assignBooth(
  volunteerId: string,
  boothId: string,
  adminUserId: string
) {
  /**
   * Check volunteer
   */
  const volunteer =
    await prisma.volunteer.findUnique({
      where: {
        id: volunteerId,
      },

      include: {
        booth: true,
      },
    });

  if (!volunteer) {
    throw new Error(
      "Volunteer not found"
    );
  }

  /**
   * Check booth
   */
  const booth =
    await prisma.booth.findUnique({
      where: {
        id: boothId,
      },

      include: {
        volunteer: true,
        assembly: true,
      },
    });

  if (!booth) {
    throw new Error(
      "Booth not found"
    );
  }

  /**
   * Booth already assigned
   */
  if (
    booth.volunteerId &&
    booth.volunteerId !== volunteerId
  ) {
    throw new Error(
      "This booth is already assigned to another volunteer"
    );
  }

  /**
   * Volunteer already has another booth
   */
  if (
    volunteer.booth &&
    volunteer.booth.id !== boothId
  ) {
    throw new Error(
      `This volunteer is already assigned to booth ${volunteer.booth.boothNumber}`
    );
  }

  /**
   * Already assigned
   */
  if (
    volunteer.booth?.id === boothId
  ) {
    return booth;
  }

  /**
   * Assign booth
   */
  const updatedBooth =
    await prisma.booth.update({
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

  /**
   * Audit log
   */
  await prisma.auditLog.create({
    data: {
      action:
        "VOLUNTEER_BOOTH_ASSIGNED",

      entity: "BOOTH",

      entityId: boothId,

      userId: adminUserId,

      volunteerId,

      details: {
        boothId,
        boothNumber:
          booth.boothNumber,
        volunteerId,
        volunteerName:
          volunteer.name,
      },
    },
  });

  return updatedBooth;
}

/**
 * Remove volunteer from booth
 */
export async function unassignBooth(
  volunteerId: string,
  adminUserId: string
) {
  const volunteer =
    await prisma.volunteer.findUnique({
      where: {
        id: volunteerId,
      },

      include: {
        booth: true,
      },
    });

  if (!volunteer) {
    throw new Error(
      "Volunteer not found"
    );
  }

  if (!volunteer.booth) {
    throw new Error(
      "Volunteer has no assigned booth"
    );
  }

  const boothId =
    volunteer.booth.id;

  const updatedBooth =
    await prisma.booth.update({
      where: {
        id: boothId,
      },

      data: {
        volunteerId: null,
      },

      include: {
        volunteer: true,
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

  /**
   * Audit log
   */
  await prisma.auditLog.create({
    data: {
      action:
        "VOLUNTEER_BOOTH_UNASSIGNED",

      entity: "BOOTH",

      entityId: boothId,

      userId: adminUserId,

      volunteerId,

      details: {
        boothId,
        boothNumber:
          volunteer.booth.boothNumber,
      },
    },
  });

  return updatedBooth;
}