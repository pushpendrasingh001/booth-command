import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import {
  create,
  getAll,
  getOne,
  update,
} from "./assembly.controller";

const router = Router();

router.use(authMiddleware);

/**
 * @swagger
 * /api/assemblies:
 *   post:
 *     summary: Create a new assembly constituency
 *     tags: [Assemblies]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - number
 *               - name
 *               - district
 *               - electionYear
 *             properties:
 *               number:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 20
 *                 example: "123"
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 example: Model Town
 *               district:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 example: North Delhi
 *               electionYear:
 *                 type: integer
 *                 minimum: 2000
 *                 maximum: 2100
 *                 example: 2025
 *     responses:
 *       201:
 *         description: Assembly created successfully
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
 *                   example: Assembly created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     assembly:
 *                       $ref: '#/components/schemas/Assembly'
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
router.post("/", create);

/**
 * @swagger
 * /api/assemblies:
 *   get:
 *     summary: Get all assembly constituencies
 *     tags: [Assemblies]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Assemblies fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     assemblies:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Assembly'
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
router.get("/", getAll);

/**
 * @swagger
 * /api/assemblies/{id}:
 *   get:
 *     summary: Get a single assembly by ID
 *     tags: [Assemblies]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Assembly UUID
 *     responses:
 *       200:
 *         description: Assembly fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     assembly:
 *                       $ref: '#/components/schemas/Assembly'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Assembly not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/:id", getOne);

/**
 * @swagger
 * /api/assemblies/{id}:
 *   patch:
 *     summary: Update an assembly constituency
 *     tags: [Assemblies]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Assembly UUID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               number:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 20
 *                 example: "124"
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 example: Model Town Updated
 *               district:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 example: Central Delhi
 *               electionYear:
 *                 type: integer
 *                 minimum: 2000
 *                 maximum: 2100
 *                 example: 2025
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Assembly updated successfully
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
 *                   example: Assembly updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     assembly:
 *                       $ref: '#/components/schemas/Assembly'
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
router.patch("/:id", update);

export default router;
