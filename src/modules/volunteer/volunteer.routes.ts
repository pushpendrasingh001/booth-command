import { Router } from "express";

import {
  authMiddleware,
} from "../../middleware/auth.middleware";

import {
  create,
  getAll,
  getOne,
  update,
  assign,
  unassign,
} from "./volunteer.controller";

const router = Router();

/**
 * All volunteer management APIs
 * require Admin authentication.
 */
router.use(authMiddleware);

/**
 * Create volunteer
 *
 * POST /api/volunteers
 */
router.post(
  "/",
  create
);

/**
 * Get all volunteers
 *
 * GET /api/volunteers
 */
router.get(
  "/",
  getAll
);

/**
 * Get volunteer
 *
 * GET /api/volunteers/:id
 */
router.get(
  "/:id",
  getOne
);

/**
 * Update volunteer
 *
 * PATCH /api/volunteers/:id
 */
router.patch(
  "/:id",
  update
);

/**
 * Assign booth
 *
 * PATCH /api/volunteers/:id/assign-booth
 */
router.patch(
  "/:id/assign-booth",
  assign
);

/**
 * Unassign booth
 *
 * DELETE /api/volunteers/:id/assign-booth
 */
router.delete(
  "/:id/assign-booth",
  unassign
);

export default router;