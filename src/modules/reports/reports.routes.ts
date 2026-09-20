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

/**
 * @swagger
 * /api/reports/summary:
 *   get:
 *     summary: Get overall assembly voter classification report summary
 *     tags: [Reports]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Summary report fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Failed to generate summary report
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
 * /api/reports/voters:
 *   get:
 *     summary: Get paginated voter report with demographic and status filters
 *     tags: [Reports]
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
 *         description: Search by voter name, EPIC, or mobile
 *       - in: query
 *         name: boothId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by booth UUID
 *       - in: query
 *         name: classification
 *         schema:
 *           type: string
 *           enum: [GREEN, YELLOW, RED, BLACK]
 *         description: Filter by voter classification
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
 *         name: gender
 *         schema:
 *           type: string
 *         description: Filter by gender
 *       - in: query
 *         name: ageFrom
 *         schema:
 *           type: integer
 *           minimum: 0
 *         description: Filter by minimum age
 *       - in: query
 *         name: ageTo
 *         schema:
 *           type: integer
 *           minimum: 0
 *         description: Filter by maximum age
 *     responses:
 *       200:
 *         description: Voter report fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: Validation error
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
 * /api/reports/booths:
 *   get:
 *     summary: Get comprehensive booth report with turnout, classification, and volunteer data
 *     tags: [Reports]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Booth report fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Failed to generate booth report
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get(
  "/booths",
  authMiddleware,
  getBooths
);

/**
 * @swagger
 * /api/reports/volunteers:
 *   get:
 *     summary: Get volunteers performance and assignment report
 *     tags: [Reports]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Volunteer report fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Failed to generate volunteer report
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get(
  "/volunteers",
  authMiddleware,
  getVolunteers
);

/**
 * @swagger
 * /api/reports/classification:
 *   get:
 *     summary: Get assembly-wide political classification breakdown report
 *     tags: [Reports]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Classification report fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Failed to generate classification report
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get(
  "/classification",
  authMiddleware,
  getClassification
);

/*
 * Exports
 */

/**
 * @swagger
 * /api/reports/export/voters:
 *   get:
 *     summary: Export filtered voter dataset to Excel (.xlsx) or CSV
 *     tags: [Reports]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: format
 *         schema:
 *           type: string
 *           enum: [xlsx, csv]
 *           default: xlsx
 *         description: Export file format
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by voter name, EPIC, or mobile
 *       - in: query
 *         name: boothId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by booth UUID
 *       - in: query
 *         name: classification
 *         schema:
 *           type: string
 *           enum: [GREEN, YELLOW, RED, BLACK]
 *         description: Filter by voter classification
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
 *         name: gender
 *         schema:
 *           type: string
 *         description: Filter by gender
 *       - in: query
 *         name: ageFrom
 *         schema:
 *           type: integer
 *           minimum: 0
 *         description: Minimum age
 *       - in: query
 *         name: ageTo
 *         schema:
 *           type: integer
 *           minimum: 0
 *         description: Maximum age
 *     responses:
 *       200:
 *         description: Downloadable Excel or CSV file
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 *           text/csv:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Validation error or export failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get(
  "/export/voters",
  authMiddleware,
  exportVoters
);

/**
 * @swagger
 * /api/reports/export/booths:
 *   get:
 *     summary: Export booth performance and classification metrics to Excel (.xlsx) or CSV
 *     tags: [Reports]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: format
 *         schema:
 *           type: string
 *           enum: [xlsx, csv]
 *           default: xlsx
 *         description: Export file format
 *     responses:
 *       200:
 *         description: Downloadable Excel or CSV file
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 *           text/csv:
 *             schema:
 *               type: string
 *               format: binary
 *       500:
 *         description: Failed to export booths
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get(
  "/export/booths",
  authMiddleware,
  exportBooths
);

/**
 * @swagger
 * /api/reports/export/volunteers:
 *   get:
 *     summary: Export volunteers list and assignments to Excel (.xlsx) or CSV
 *     tags: [Reports]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: format
 *         schema:
 *           type: string
 *           enum: [xlsx, csv]
 *           default: xlsx
 *         description: Export file format
 *     responses:
 *       200:
 *         description: Downloadable Excel or CSV file
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 *           text/csv:
 *             schema:
 *               type: string
 *               format: binary
 *       500:
 *         description: Failed to export volunteers
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get(
  "/export/volunteers",
  authMiddleware,
  exportVolunteers
);

/**
 * @swagger
 * /api/reports/export/classification:
 *   get:
 *     summary: Export political classification statistics to Excel (.xlsx) or CSV
 *     tags: [Reports]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: format
 *         schema:
 *           type: string
 *           enum: [xlsx, csv]
 *           default: xlsx
 *         description: Export file format
 *     responses:
 *       200:
 *         description: Downloadable Excel or CSV file
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 *           text/csv:
 *             schema:
 *               type: string
 *               format: binary
 *       500:
 *         description: Failed to export classification
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get(
  "/export/classification",
  authMiddleware,
  exportClassification
);

export default router;