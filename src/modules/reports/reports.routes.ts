import { Router } from "express";

import {
  getSummary,
  getVoters,
  getBooths,
  getVolunteers,
  getClassification,
  exportVoters,
  exportBooths,
  exportVolunteers,
  exportClassification,
} from "./reports.controller.js";

import { authMiddleware } from "../../middleware/auth.middleware.js";

const router = Router();

/*
 * Reports
 */
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

router.get(
  "/booths",
  authMiddleware,
  getBooths
);

router.get(
  "/volunteers",
  authMiddleware,
  getVolunteers
);

router.get(
  "/classification",
  authMiddleware,
  getClassification
);

/*
 * Exports
 */
router.get(
  "/export/voters",
  authMiddleware,
  exportVoters
);

router.get(
  "/export/booths",
  authMiddleware,
  exportBooths
);

router.get(
  "/export/volunteers",
  authMiddleware,
  exportVolunteers
);

router.get(
  "/export/classification",
  authMiddleware,
  exportClassification
);

export default router;