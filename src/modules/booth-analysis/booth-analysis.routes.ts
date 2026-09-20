import {
  Router,
} from "express";

import {
  authMiddleware,
} from "../../middleware/auth.middleware.js";

import {
  getStrong,
  getWeak,
  getOpportunity,
  getConfidence,
  getSingleBooth,
} from "./booth-analysis.controller.js";

const router =
  Router();

// ========================================
// BOOTH ANALYSIS
// ========================================

router.get(
  "/strong",
  authMiddleware,
  getStrong
);

router.get(
  "/weak",
  authMiddleware,
  getWeak
);

router.get(
  "/opportunity",
  authMiddleware,
  getOpportunity
);

router.get(
  "/confidence",
  authMiddleware,
  getConfidence
);

router.get(
  "/:id",
  authMiddleware,
  getSingleBooth
);

export default router;