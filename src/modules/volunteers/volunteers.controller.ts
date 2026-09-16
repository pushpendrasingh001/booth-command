import { Request, Response } from "express";

import {
  createVolunteer,
  getVolunteers,
  getVolunteerById,
  updateVolunteer,
  assignBooth,
} from "./volunteers.service";

import {
  createVolunteerSchema,
  updateVolunteerSchema,
  assignBoothSchema,
} from "./volunteers.validation";

export async function create(req: Request, res: Response) {
  try {
    const input = createVolunteerSchema.parse(req.body);
    const volunteer = await createVolunteer(input);

    return res.status(201).json({
      success: true,
      message: "Volunteer created successfully",
      data: { volunteer },
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create volunteer",
    });
  }
}

export async function getAll(_req: Request, res: Response) {
  try {
    const volunteers = await getVolunteers();

    return res.status(200).json({
      success: true,
      data: { volunteers },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch volunteers",
    });
  }
}

export async function getOne(req: Request, res: Response) {
  try {
    const volunteer = await getVolunteerById(
      String(req.params.id)
    );

    return res.status(200).json({
      success: true,
      data: { volunteer },
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Volunteer not found",
    });
  }
}

export async function update(req: Request, res: Response) {
  try {
    const input = updateVolunteerSchema.parse(req.body);

    const volunteer = await updateVolunteer(
      String(req.params.id),
      input
    );

    return res.status(200).json({
      success: true,
      message: "Volunteer updated successfully",
      data: { volunteer },
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update volunteer",
    });
  }
}

export async function assign(req: Request, res: Response) {
  try {
    const { boothId } = assignBoothSchema.parse(req.body);

    const booth = await assignBooth(
      String(req.params.id),
      boothId
    );

    return res.status(200).json({
      success: true,
      message: "Booth assigned successfully",
      data: { booth },
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to assign booth",
    });
  }
}