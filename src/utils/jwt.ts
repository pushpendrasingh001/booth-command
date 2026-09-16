import jwt from "jsonwebtoken";

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }

  return secret;
}

const JWT_SECRET = getJwtSecret();

export interface JwtPayload {
  userId: string;
  role: "ADMIN";
}

export function generateAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "1d",
  });
}

export function verifyAccessToken(token: string): JwtPayload {
  const decoded = jwt.verify(token, JWT_SECRET);

  if (typeof decoded === "string") {
    throw new Error("Invalid JWT token");
  }

  if (
    typeof decoded.userId !== "string" ||
    typeof decoded.role !== "string"
  ) {
    throw new Error("Invalid JWT payload");
  }

  if (decoded.role !== "ADMIN") {
    throw new Error("Invalid JWT role");
  }

  return {
    userId: decoded.userId,
    role: "ADMIN",
  };
}