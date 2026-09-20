import {
  Router,
} from "express";

import {
  authMiddleware,
} from "../../middleware/auth.middleware.js";

import {
  getOverview,
  getClassification,
  getVerification,
  getBooths,
  getBooth,
} from "./analytics.controller.js";

const router =
  Router();

// ========================================
// ANALYTICS
// ========================================

// Dashboard overview
router.get(
  "/overview",
  authMiddleware,
  getOverview
);

// Classification analytics
router.get(
  "/classification",
  authMiddleware,
  getClassification
);

// Verification analytics
router.get(
  "/verification",
  authMiddleware,
  getVerification
);

// All booth analytics
router.get(
  "/booths",
  authMiddleware,
  getBooths
);

// Single booth analytics
router.get(
  "/booths/:id",
  authMiddleware,
  getBooth
);

export default router;