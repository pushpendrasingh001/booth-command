import { Router } from "express";

import { login } from "./volunteer-auth.controller";

const router = Router();

/**
 * @swagger
 * /api/volunteer-auth/login:
 *   post:
 *     summary: Volunteer login using mobile number and password
 *     description: >
 *       Authenticates a volunteer using their registered mobile number and password.
 *       Returns a Volunteer JWT on success.
 *       The volunteer must be ACTIVE and have an assigned Booth to log in.
 *       This endpoint uses bcrypt password verification — no Firebase or OTP involved.
 *     tags: [Volunteer Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - mobile
 *               - password
 *             properties:
 *               mobile:
 *                 type: string
 *                 description: 10-digit Indian mobile number
 *                 pattern: ^[6-9]\d{9}$
 *                 example: "9876543210"
 *               password:
 *                 type: string
 *                 description: Volunteer password set by Admin
 *                 minLength: 6
 *                 example: "Rahul@123"
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
 *                     accessToken:
 *                       type: string
 *                       description: Volunteer JWT (Bearer token)
 *                       example: eyJhbGciOiJIUzI1NiIs...
 *                     volunteer:
 *                       $ref: '#/components/schemas/Volunteer'
 *       401:
 *         description: Invalid mobile number or password
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Volunteer is inactive or has no assigned booth
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/login", login);

export default router;
