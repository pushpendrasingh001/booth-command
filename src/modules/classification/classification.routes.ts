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

/**
 * @swagger
 * /api/classification/summary:
 *   get:
 *     summary: Get assembly voter classification summary counts and percentages
 *     tags: [Classification]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Classification summary fetched successfully
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
 *                   example: Classification summary fetched successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalVoters:
 *                       type: integer
 *                       example: 10000
 *                     classifiedVoters:
 *                       type: integer
 *                       example: 7500
 *                     unclassifiedVoters:
 *                       type: integer
 *                       example: 2500
 *                     green:
 *                       type: object
 *                       properties:
 *                         count:
 *                           type: integer
 *                           example: 4500
 *                         percentage:
 *                           type: number
 *                           example: 45
 *                     yellow:
 *                       type: object
 *                       properties:
 *                         count:
 *                           type: integer
 *                           example: 1500
 *                         percentage:
 *                           type: number
 *                           example: 15
 *                     red:
 *                       type: object
 *                       properties:
 *                         count:
 *                           type: integer
 *                           example: 1000
 *                         percentage:
 *                           type: number
 *                           example: 10
 *                     black:
 *                       type: object
 *                       properties:
 *                         count:
 *                           type: integer
 *                           example: 500
 *                         percentage:
 *                           type: number
 *                           example: 5
 *       400:
 *         description: Failed to fetch classification summary
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
  "/summary",
  authMiddleware,
  getSummary
);

/**
 * @swagger
 * /api/classification/voters:
 *   get:
 *     summary: Get voters list with classification, verification, and booth filters
 *     tags: [Classification]
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
 *         description: Search by voter name or EPIC
 *       - in: query
 *         name: classification
 *         schema:
 *           type: string
 *           enum: [GREEN, YELLOW, RED, BLACK]
 *         description: Filter by political classification
 *       - in: query
 *         name: verification
 *         schema:
 *           type: string
 *           enum: [VERIFIED, UNVERIFIED]
 *         description: Filter by verification status
 *       - in: query
 *         name: voteStatus
 *         schema:
 *           type: string
 *           enum: [PENDING, DONE]
 *         description: Filter by vote status
 *       - in: query
 *         name: boothId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by booth UUID
 *     responses:
 *       200:
 *         description: Classification voters fetched successfully
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
 *                   example: Classification voters fetched successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     voters:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Voter'
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 20
 *                     total:
 *                       type: integer
 *                       example: 100
 *                     totalPages:
 *                       type: integer
 *                       example: 5
 *       400:
 *         description: Failed to fetch voters
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
  "/voters",
  authMiddleware,
  getVoters
);

/**
 * @swagger
 * /api/classification/voters/{id}:
 *   patch:
 *     summary: Update single voter classification, verification, or voteStatus
 *     description: Admin updates voter classification. Automatically logs to ClassificationHistory with admin actor.
 *     tags: [Classification]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Voter UUID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               classification:
 *                 type: string
 *                 enum: [GREEN, YELLOW, RED, BLACK]
 *                 example: GREEN
 *               verification:
 *                 type: string
 *                 enum: [VERIFIED, UNVERIFIED]
 *                 example: VERIFIED
 *               voteStatus:
 *                 type: string
 *                 enum: [PENDING, DONE]
 *                 example: DONE
 *     responses:
 *       200:
 *         description: Voter classification updated successfully
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
 *                   example: Voter classification updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/Voter'
 *       400:
 *         description: Validation error or update failed
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
  "/voters/:id",
  authMiddleware,
  updateVoterClassification
);

/**
 * @swagger
 * /api/classification/bulk:
 *   post:
 *     summary: Bulk update voter classifications
 *     description: Bulk updates classification for up to 1000 voters and records history for each change.
 *     tags: [Classification]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - voterIds
 *               - classification
 *             properties:
 *               voterIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uuid
 *                 minItems: 1
 *                 maxItems: 1000
 *               classification:
 *                 type: string
 *                 enum: [GREEN, YELLOW, RED, BLACK]
 *                 example: GREEN
 *     responses:
 *       200:
 *         description: Bulk classification completed successfully
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
 *                   example: Bulk classification completed successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     count:
 *                       type: integer
 *                       example: 50
 *       400:
 *         description: Validation error or bulk update failed
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
router.post(
  "/bulk",
  authMiddleware,
  bulkClassification
);

export default router;