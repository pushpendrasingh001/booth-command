import { prisma } from "../../config/prisma";
import { comparePassword } from "../../utils/password";
import {
  generateVolunteerAccessToken,
} from "../../utils/volunteer-jwt";

import {
  VolunteerLoginInput,
} from "./volunteer-auth.validation";

export async function loginVolunteer(
  input: VolunteerLoginInput
) {
  // Find volunteer by mobile
  const volunteer =
    await prisma.volunteer.findUnique({
      where: {
        mobile: input.mobile,
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
    throw new Error(
      "Invalid mobile number or password"
    );
  }

  // Check volunteer status before password comparison
  // (avoids leaking which check failed)
  if (volunteer.status !== "ACTIVE") {
    throw new Error(
      "Volunteer account is inactive"
    );
  }

  // Compare provided password with stored bcrypt hash
  const passwordMatch = await comparePassword(
    input.password,
    volunteer.password
  );

  if (!passwordMatch) {
    throw new Error(
      "Invalid mobile number or password"
    );
  }

  // A volunteer must have an assigned booth to log in
  if (!volunteer.booth) {
    throw new Error(
      "No booth is assigned to this volunteer"
    );
  }

  // Generate Volunteer JWT
  const accessToken =
    generateVolunteerAccessToken({
      volunteerId: volunteer.id,
      role: "VOLUNTEER",
    });

  return {
    accessToken,

    volunteer: {
      id: volunteer.id,
      name: volunteer.name,
      mobile: volunteer.mobile,
      status: volunteer.status,

      booth: volunteer.booth,
    },
  };
}