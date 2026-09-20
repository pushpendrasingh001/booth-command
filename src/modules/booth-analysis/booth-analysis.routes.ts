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

/**
 * @swagger
 * /api/analytics/booths/strong:
 *   get:
 *     summary: Get strong booths (high Green % based on configured system thresholds)
 *     tags: [Booth Analysis]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         description: Results per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by booth number or name
 *     responses:
 *       200:
 *         description: Strong booths fetched successfully
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
 *                   example: Strong booths fetched successfully
 *                 data:
 *                   type: object
 *       400:
 *         description: Failed to fetch strong booths
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
router.get(
  "/strong",
  authMiddleware,
  getStrong
);

/**
 * @swagger
 * /api/analytics/booths/weak:
 *   get:
 *     summary: Get weak booths (low Green % based on configured system thresholds)
 *     tags: [Booth Analysis]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         description: Results per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by booth number or name
 *     responses:
 *       200:
 *         description: Weak booths fetched successfully
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
 *                   example: Weak booths fetched successfully
 *                 data:
 *                   type: object
 *       400:
 *         description: Failed to fetch weak booths
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
router.get(
  "/weak",
  authMiddleware,
  getWeak
);

/**
 * @swagger
 * /api/analytics/booths/opportunity:
 *   get:
 *     summary: Get opportunity booths (high Yellow % swing voter opportunities)
 *     tags: [Booth Analysis]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         description: Results per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by booth number or name
 *     responses:
 *       200:
 *         description: Opportunity booths fetched successfully
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
 *                   example: Opportunity booths fetched successfully
 *                 data:
 *                   type: object
 *       400:
 *         description: Failed to fetch opportunity booths
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
router.get(
  "/opportunity",
  authMiddleware,
  getOpportunity
);

/**
 * @swagger
 * /api/analytics/booths/confidence:
 *   get:
 *     summary: Get high confidence booths (high verified voter data)
 *     tags: [Booth Analysis]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         description: Results per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by booth number or name
 *     responses:
 *       200:
 *         description: High confidence booths fetched successfully
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
 *                   example: High confidence booths fetched successfully
 *                 data:
 *                   type: object
 *       400:
 *         description: Failed to fetch confidence booths
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
router.get(
  "/confidence",
  authMiddleware,
  getConfidence
);

/**
 * @swagger
 * /api/analytics/booths/{id}:
 *   get:
 *     summary: Get comprehensive strength, weakness, and classification analysis for a booth
 *     tags: [Booth Analysis]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Booth UUID
 *     responses:
 *       200:
 *         description: Booth analysis fetched successfully
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
 *                   example: Booth analysis fetched successfully
 *                 data:
 *                   type: object
 *       400:
 *         description: Failed to fetch booth analysis
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
router.get(
  "/:id",
  authMiddleware,
  getSingleBooth
);

export default router;