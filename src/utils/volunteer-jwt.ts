import jwt, {
  JwtPayload,
  SignOptions,
} from "jsonwebtoken";

function getVolunteerJwtSecret(): string {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }

  return secret;
}

const JWT_SECRET: string = getVolunteerJwtSecret();

export interface VolunteerJwtPayload {
  volunteerId: string;
  role: "VOLUNTEER";
}

export function generateVolunteerAccessToken(
  payload: VolunteerJwtPayload
): string {
  const options: SignOptions = {
    expiresIn: "1d",
  };

  return jwt.sign(
    payload,
    JWT_SECRET,
    options
  );
}

export function verifyVolunteerAccessToken(
  token: string
): VolunteerJwtPayload {
  const decoded = jwt.verify(
    token,
    JWT_SECRET
  );

  if (
    typeof decoded === "string" ||
    !decoded ||
    typeof decoded !== "object"
  ) {
    throw new Error("Invalid volunteer token");
  }

  const payload = decoded as JwtPayload & {
    volunteerId?: unknown;
    role?: unknown;
  };

  if (
    typeof payload.volunteerId !== "string" ||
    payload.role !== "VOLUNTEER"
  ) {
    throw new Error(
      "Invalid volunteer token payload"
    );
  }

  return {
    volunteerId: payload.volunteerId,
    role: "VOLUNTEER",
  };
}