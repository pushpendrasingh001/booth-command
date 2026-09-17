import { prisma } from "../../config/prisma";
import { firebaseAuth } from "../../config/firebase";
import {
  generateVolunteerAccessToken,
} from "../../utils/volunteer-jwt";

import {
  VolunteerLoginInput,
} from "./volunteer-auth.validation";

export async function loginVolunteer(
  input: VolunteerLoginInput
) {
  // Verify Firebase ID token
  const decodedToken =
    await firebaseAuth.verifyIdToken(input.idToken);

  const firebaseUid = decodedToken.uid;

  // Firebase Phone Authentication normally provides
  // the phone number in decodedToken.phone_number
  const mobile = decodedToken.phone_number;

  if (!mobile) {
    throw new Error(
      "Phone number not found in Firebase token"
    );
  }

  // Remove +91 before searching our database
  const normalizedMobile = mobile.replace(
    /^\+91/,
    ""
  );

  // Find volunteer using Firebase UID first
  let volunteer =
    await prisma.volunteer.findUnique({
      where: {
        firebaseUid,
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

  // If Firebase UID isn't linked yet,
  // find volunteer by mobile number
  if (!volunteer) {
    volunteer =
      await prisma.volunteer.findUnique({
        where: {
          mobile: normalizedMobile,
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
        "No volunteer found for this mobile number"
      );
    }

    // Link Firebase UID with volunteer
    volunteer =
      await prisma.volunteer.update({
        where: {
          id: volunteer.id,
        },

        data: {
          firebaseUid,
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

  // Check volunteer status
  if (volunteer.status !== "ACTIVE") {
    throw new Error(
      "Volunteer account is inactive"
    );
  }

  // A volunteer must have a booth
  if (!volunteer.booth) {
    throw new Error(
      "No booth is assigned to this volunteer"
    );
  }

  // Generate our backend JWT
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