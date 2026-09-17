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
 * @swagger
 * /api/volunteers:
 *   post:
 *     summary: Create a new volunteer
 *     tags: [Volunteers]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - mobile
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 example: Rajesh Kumar
 *               mobile:
 *                 type: string
 *                 pattern: ^[6-9]\d{9}$
 *                 example: "9876543210"
 *     responses:
 *       201:
 *         description: Volunteer created successfully
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
 *                   example: Volunteer created successfully
 *                 data:
 *                   $ref: '#/components/schemas/Volunteer'
 *       400:
 *         description: Validation error or creation failed
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
  "/",
  create
);

/**
 * @swagger
 * /api/volunteers:
 *   get:
 *     summary: Get all volunteers
 *     tags: [Volunteers]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Volunteers fetched successfully
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
 *                   example: Volunteers fetched successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Volunteer'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get(
  "/",
  getAll
);

/**
 * @swagger
 * /api/volunteers/{id}:
 *   get:
 *     summary: Get a single volunteer by ID
 *     tags: [Volunteers]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Volunteer UUID
 *     responses:
 *       200:
 *         description: Volunteer fetched successfully
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
 *                   example: Volunteer fetched successfully
 *                 data:
 *                   $ref: '#/components/schemas/Volunteer'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Volunteer not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get(
  "/:id",
  getOne
);

/**
 * @swagger
 * /api/volunteers/{id}:
 *   patch:
 *     summary: Update a volunteer
 *     tags: [Volunteers]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Volunteer UUID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 example: Rajesh Kumar Updated
 *               mobile:
 *                 type: string
 *                 pattern: ^[6-9]\d{9}$
 *                 example: "9876543211"
 *               status:
 *                 type: string
 *                 enum: [ACTIVE, INACTIVE]
 *                 example: ACTIVE
 *     responses:
 *       200:
 *         description: Volunteer updated successfully
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
 *                   example: Volunteer updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/Volunteer'
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
  "/:id",
  update
);

/**
 * @swagger
 * /api/volunteers/{id}/assign-booth:
 *   patch:
 *     summary: Assign a booth to a volunteer
 *     tags: [Volunteers]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Volunteer UUID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - boothId
 *             properties:
 *               boothId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       200:
 *         description: Booth assigned successfully
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
 *                   example: Booth assigned successfully
 *                 data:
 *                   type: object
 *       400:
 *         description: Validation error or assign failed
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
  "/:id/assign-booth",
  assign
);

/**
 * @swagger
 * /api/volunteers/{id}/assign-booth:
 *   delete:
 *     summary: Unassign booth from a volunteer
 *     tags: [Volunteers]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Volunteer UUID
 *     responses:
 *       200:
 *         description: Booth unassigned successfully
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
 *                   example: Booth unassigned successfully
 *                 data:
 *                   type: object
 *       400:
 *         description: Unassign failed
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
router.delete(
  "/:id/assign-booth",
  unassign
);

export default router;
