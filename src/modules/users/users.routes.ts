import { Router } from "express";

import {
  listUsers,
  getUser,
  editUser,
  changeUserStatus,
  changeUserPassword,
} from "./users.controller.js";

import {
  authMiddleware,
} from "../../middleware/auth.middleware.js";

const router = Router();

/**
 * User management
 *
 * There is intentionally NO
 * POST /api/users route.
 */

router.get(
  "/",
  authMiddleware,
  listUsers
);

router.get(
  "/:id",
  authMiddleware,
  getUser
);

router.patch(
  "/:id",
  authMiddleware,
  editUser
);

router.patch(
  "/:id/status",
  authMiddleware,
  changeUserStatus
);

router.patch(
  "/:id/password",
  authMiddleware,
  changeUserPassword
);

export default router;