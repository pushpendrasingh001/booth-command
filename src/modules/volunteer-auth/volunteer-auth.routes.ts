import { Router } from "express";

import { login } from "./volunteer-auth.controller";

const router = Router();

/**
 * @swagger
 * /api/volunteer-auth/login:
 *   post:
 *     summary: Volunteer login via Firebase ID token
 *     tags: [Volunteer Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - idToken
 *             properties:
 *               idToken:
 *                 type: string
 *                 description: Firebase ID token from client
 *                 example: eyJhbGciOiJSUzI1NiIs...
 *     responses:
 *       200:
 *         description: Volunteer login successful
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
 *                   example: Volunteer login successful
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIs...
 *                     volunteer:
 *                       $ref: '#/components/schemas/Volunteer'
 *       401:
 *         description: Volunteer login failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/login", login);

export default router;
