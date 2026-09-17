import { NextFunction, Request, Response } from "express";

import { prisma } from "../config/prisma";

import {
  verifyVolunteerAccessToken,
} from "../utils/volunteer-jwt";

export interface VolunteerAuthRequest
  extends Request {
  volunteer?: {
    id: string;
    name: string;
    mobile: string;
    status: "ACTIVE" | "INACTIVE";
    booth: {
      id: string;
      boothNumber: string;
      name: string;
      village: string | null;
      assemblyId: string;
    } | null;
  };
}

export async function volunteerAuthMiddleware(
  req: VolunteerAuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader =
      req.headers.authorization;

    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ) {
      return res.status(401).json({
        success: false,
        message:
          "Volunteer authentication token is required",
      });
    }

    const token = authHeader.substring(7);

    const payload =
      verifyVolunteerAccessToken(token);

    if (payload.role !== "VOLUNTEER") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const volunteer =
      await prisma.volunteer.findUnique({
        where: {
          id: payload.volunteerId,
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
      return res.status(401).json({
        success: false,
        message: "Volunteer not found",
      });
    }

    if (volunteer.status !== "ACTIVE") {
      return res.status(403).json({
        success: false,
        message: "Volunteer account is inactive",
      });
    }

    if (!volunteer.booth) {
      return res.status(403).json({
        success: false,
        message:
          "No booth is assigned to this volunteer",
      });
    }

    req.volunteer = volunteer;

    next();
  } catch (error) {
    console.error(
      "Volunteer authentication error:",
      error
    );

    return res.status(401).json({
      success: false,
      message:
        "Invalid or expired volunteer token",
    });
  }
}