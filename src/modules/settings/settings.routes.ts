import { Router } from "express";

import {
  getSystemSettings,
  updateSystemSettings,
} from "./settings.controller.js";

import {
  authMiddleware,
} from "../../middleware/auth.middleware.js";

const router = Router();

/**
 * System Settings
 *
 * All existing ADMIN users have
 * full access to these APIs.
 */

router.get(
  "/",
  authMiddleware,
  getSystemSettings
);

router.patch(
  "/",
  authMiddleware,
  updateSystemSettings
);

export default router;