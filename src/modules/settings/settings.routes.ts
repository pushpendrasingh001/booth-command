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
 * @swagger
 * /api/settings:
 *   get:
 *     summary: Get system settings analysis thresholds
 *     tags: [Settings]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: System settings fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/SystemSettings'
 *       500:
 *         description: Failed to fetch system settings
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get(
  "/",
  authMiddleware,
  getSystemSettings
);

/**
 * @swagger
 * /api/settings:
 *   patch:
 *     summary: Update system settings analysis thresholds
 *     description: >
 *       Update configurable analysis thresholds.
 *       Enforces that:
 *       - strongGreenPercent >= moderateGreenPercent
 *       - highOpportunityYellow >= mediumOpportunityYellow
 *       - highVerification >= mediumVerification
 *     tags: [Settings]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               strongGreenPercent:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 100
 *                 example: 55
 *               moderateGreenPercent:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 100
 *                 example: 40
 *               highOpportunityYellow:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 100
 *                 example: 15
 *               mediumOpportunityYellow:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 100
 *                 example: 8
 *               highVerification:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 100
 *                 example: 80
 *               mediumVerification:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 100
 *                 example: 50
 *     responses:
 *       200:
 *         description: System settings updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: System settings updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/SystemSettings'
 *       400:
 *         description: Validation error or invalid threshold relationship
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.patch(
  "/",
  authMiddleware,
  updateSystemSettings
);

export default router;