import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { prisma } from "./config/prisma";
import authRoutes from "./modules/auth/auth.routes";
import usersRoutes from "./modules/users/users.routes";
import assemblyRoutes from "./modules/assembly/assembly.routes";
import boothsRoutes from "./modules/booths/booths.routes";
import volunteersRoutes from "./modules/volunteer/volunteer.routes";
import volunteerAuthRoutes from "./modules/volunteer-auth/volunteer-auth.routes";
import votersRoutes from "./modules/voters/voters.routes";
import volunteerVoterRoutes from "./modules/volunteer-voters/volunteer-voters.routes";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.js";
const app = express();

app.use(helmet());

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));


// ========================================
// HEALTH
// ========================================

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Check API health and database connectivity
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Backend is running and database is connected
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
 *                   example: Booth Command Backend is running
 *                 database:
 *                   type: string
 *                   example: connected
 *       500:
 *         description: Database connection failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Database connection failed
 */
app.get("/api/health", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    res.status(200).json({
      success: true,
      message: "Booth Command Backend is running",
      database: "connected",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
});


// ========================================
// AUTH
// ========================================

app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/assemblies", assemblyRoutes);
app.use("/api/booths", boothsRoutes);
app.use("/api/volunteers", volunteersRoutes);
app.use("/api/volunteer-auth",volunteerAuthRoutes);
app.use("/api/voters", votersRoutes);
app.use("/api/volunteer-voters", volunteerVoterRoutes);
app.use("/api-docs",swaggerUi.serve,swaggerUi.setup(swaggerSpec));


export default app;