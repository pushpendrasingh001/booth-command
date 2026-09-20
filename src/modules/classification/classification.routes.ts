import {
  Router,
} from "express";

import {
  authMiddleware,
} from "../../middleware/auth.middleware.js";

import {
  getSummary,
  getVoters,
  updateVoterClassification,
  bulkClassification,
} from "./classification.controller.js";

const router =
  Router();

// ========================================
// ADMIN CLASSIFICATION APIs
// ========================================

router.get(
  "/summary",
  authMiddleware,
  getSummary
);

router.get(
  "/voters",
  authMiddleware,
  getVoters
);

router.patch(
  "/voters/:id",
  authMiddleware,
  updateVoterClassification
);

router.post(
  "/bulk",
  authMiddleware,
  bulkClassification
);

export default router;