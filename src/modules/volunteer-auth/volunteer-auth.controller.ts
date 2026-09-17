import { Request, Response } from "express";

import { loginVolunteer } from "./volunteer-auth.service";

import {
  volunteerLoginSchema,
} from "./volunteer-auth.validation";

export async function login(
  req: Request,
  res: Response
) {
  try {
    const input =
      volunteerLoginSchema.parse(req.body);

    const result =
      await loginVolunteer(input);

    return res.status(200).json({
      success: true,
      message: "Volunteer login successful",
      data: result,
    });
  } catch (error) {
    console.error(error);

    return res.status(401).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Volunteer login failed",
    });
  }
}