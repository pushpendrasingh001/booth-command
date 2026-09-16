import { Request, Response } from "express";
import { loginAdmin } from "./auth.service";
import { loginSchema } from "./auth.validation";
import { AuthRequest } from "../../middleware/auth.middleware";

export async function login(req: Request, res: Response) {
  try {
    const input = loginSchema.parse(req.body);

    const result = await loginAdmin(input);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error) {
    console.error(error);

    if (error instanceof Error) {
      return res.status(401).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export async function getMe(req: AuthRequest, res: Response) {
  return res.status(200).json({
    success: true,
    message: "Authenticated user",
    data: {
      user: req.user,
    },
  });
}