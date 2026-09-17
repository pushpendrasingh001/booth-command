import { Router } from "express";

import {
  authMiddleware,
} from "../../middleware/auth.middleware";

import {
  getAllVoters,
  getOneVoter,
  updateOneVoter,
} from "./voters.controller";

import {
  importVoterFile,
} from "./voter-import.controller";

import { upload } from "../../config/upload";

const router = Router();

/**
 * All voter APIs are Admin protected
 */
router.use(authMiddleware);

/**
 * Import voters
 *
 * POST /api/voters/import
 */
router.post(
  "/import",
  upload.single("file"),
  importVoterFile
);

/**
 * Get voters
 *
 * GET /api/voters
 */
router.get(
  "/",
  getAllVoters
);

/**
 * Get voter
 *
 * GET /api/voters/:id
 */
router.get(
  "/:id",
  getOneVoter
);

/**
 * Update voter
 *
 * PATCH /api/voters/:id
 */
router.patch(
  "/:id",
  updateOneVoter
);

export default router;