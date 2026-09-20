import {
  Request,
  Response,
} from "express";

import {
  boothAnalysisFilterSchema,
} from "./booth-analysis.validation.js";

import {
  getStrongBooths,
  getWeakBooths,
  getOpportunityBooths,
  getConfidenceBooths,
  getBoothAnalysis,
} from "./booth-analysis.service.js";

// ========================================
// STRONG
// ========================================

export async function getStrong(
  req: Request,
  res: Response
) {
  try {
    const filters =
      boothAnalysisFilterSchema.parse(
        req.query
      );

    const result =
      await getStrongBooths(
        filters
      );

    return res.status(200).json({
      success: true,

      message:
        "Strong booths fetched successfully",

      data: result,
    });
  } catch (error) {
    console.error(
      "Strong booth analysis error:",
      error
    );

    return res.status(400).json({
      success: false,

      message:
        error instanceof Error
          ? error.message
          : "Failed to fetch strong booths",
    });
  }
}

// ========================================
// WEAK
// ========================================

export async function getWeak(
  req: Request,
  res: Response
) {
  try {
    const filters =
      boothAnalysisFilterSchema.parse(
        req.query
      );

    const result =
      await getWeakBooths(
        filters
      );

    return res.status(200).json({
      success: true,

      message:
        "Weak booths fetched successfully",

      data: result,
    });
  } catch (error) {
    console.error(
      "Weak booth analysis error:",
      error
    );

    return res.status(400).json({
      success: false,

      message:
        error instanceof Error
          ? error.message
          : "Failed to fetch weak booths",
    });
  }
}

// ========================================
// OPPORTUNITY
// ========================================

export async function getOpportunity(
  req: Request,
  res: Response
) {
  try {
    const filters =
      boothAnalysisFilterSchema.parse(
        req.query
      );

    const result =
      await getOpportunityBooths(
        filters
      );

    return res.status(200).json({
      success: true,

      message:
        "Opportunity booths fetched successfully",

      data: result,
    });
  } catch (error) {
    console.error(
      "Opportunity booth analysis error:",
      error
    );

    return res.status(400).json({
      success: false,

      message:
        error instanceof Error
          ? error.message
          : "Failed to fetch opportunity booths",
    });
  }
}

// ========================================
// CONFIDENCE
// ========================================

export async function getConfidence(
  req: Request,
  res: Response
) {
  try {
    const filters =
      boothAnalysisFilterSchema.parse(
        req.query
      );

    const result =
      await getConfidenceBooths(
        filters
      );

    return res.status(200).json({
      success: true,

      message:
        "High confidence booths fetched successfully",

      data: result,
    });
  } catch (error) {
    console.error(
      "Confidence booth analysis error:",
      error
    );

    return res.status(400).json({
      success: false,

      message:
        error instanceof Error
          ? error.message
          : "Failed to fetch confidence booths",
    });
  }
}

// ========================================
// SINGLE BOOTH
// ========================================

export async function getSingleBooth(
  req: Request,
  res: Response
) {
  try {
    const boothId =
      String(req.params.id);

    const result =
      await getBoothAnalysis(
        boothId
      );

    return res.status(200).json({
      success: true,

      message:
        "Booth analysis fetched successfully",

      data: result,
    });
  } catch (error) {
    console.error(
      "Single booth analysis error:",
      error
    );

    return res.status(400).json({
      success: false,

      message:
        error instanceof Error
          ? error.message
          : "Failed to fetch booth analysis",
    });
  }
}