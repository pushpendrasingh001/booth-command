import {
  Response,
} from "express";

import {
  AuthRequest,
} from "../../middleware/auth.middleware.js";

import {
  classificationFilterSchema,
  updateClassificationSchema,
  bulkClassificationSchema,
} from "./classification.validation.js";

import {
  getClassificationSummary,
  getClassificationVoters,
  updateClassification,
  bulkUpdateClassification,
} from "./classification.service.js";

// ========================================
// SUMMARY
// ========================================

export async function getSummary(
  req: AuthRequest,
  res: Response
) {
  try {
    const result =
      await getClassificationSummary();

    return res.status(200).json({
      success: true,

      message:
        "Classification summary fetched successfully",

      data: result,
    });
  } catch (error) {
    console.error(
      "Classification summary error:",
      error
    );

    return res.status(400).json({
      success: false,

      message:
        error instanceof Error
          ? error.message
          : "Failed to fetch classification summary",
    });
  }
}

// ========================================
// VOTER LIST
// ========================================

export async function getVoters(
  req: AuthRequest,
  res: Response
) {
  try {
    const filters =
      classificationFilterSchema.parse(
        req.query
      );

    const result =
      await getClassificationVoters(
        filters
      );

    return res.status(200).json({
      success: true,

      message:
        "Classification voters fetched successfully",

      data: result,
    });
  } catch (error) {
    console.error(
      "Classification voters error:",
      error
    );

    return res.status(400).json({
      success: false,

      message:
        error instanceof Error
          ? error.message
          : "Failed to fetch voters",
    });
  }
}

// ========================================
// UPDATE
// ========================================

export async function updateVoterClassification(
  req: AuthRequest,
  res: Response
) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message:
          "Admin authentication required",
      });
    }

    const voterId =
      String(req.params.id);

    const input =
      updateClassificationSchema.parse(
        req.body
      );

    const result =
      await updateClassification(
        voterId,
        input,
        req.user.id
      );

    return res.status(200).json({
      success: true,

      message:
        "Voter classification updated successfully",

      data: result,
    });
  } catch (error) {
    console.error(
      "Update classification error:",
      error
    );

    return res.status(400).json({
      success: false,

      message:
        error instanceof Error
          ? error.message
          : "Failed to update classification",
    });
  }
}

// ========================================
// BULK
// ========================================

export async function bulkClassification(
  req: AuthRequest,
  res: Response
) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message:
          "Admin authentication required",
      });
    }

    const input =
      bulkClassificationSchema.parse(
        req.body
      );

    const result =
      await bulkUpdateClassification(
        input,
        req.user.id
      );

    return res.status(200).json({
      success: true,

      message:
        "Bulk classification completed successfully",

      data: result,
    });
  } catch (error) {
    console.error(
      "Bulk classification error:",
      error
    );

    return res.status(400).json({
      success: false,

      message:
        error instanceof Error
          ? error.message
          : "Failed to update classifications",
    });
  }
}