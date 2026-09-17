import jwt, {
  JwtPayload,
  SignOptions,
} from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  throw new Error("JWT_SECRET is not defined");
}

const JWT_SECRET: string = jwtSecret;

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