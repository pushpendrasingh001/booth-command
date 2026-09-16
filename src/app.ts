import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { prisma } from "./config/prisma";
import authRoutes from "./modules/auth/auth.routes";
import usersRoutes from "./modules/users/users.routes";
import assemblyRoutes from "./modules/assembly/assembly.routes";
import boothsRoutes from "./modules/booths/booths.routes";
import volunteersRoutes from "./modules/volunteers/volunteers.routes";
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


export default app;