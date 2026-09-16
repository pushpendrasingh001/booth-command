import { prisma } from "../../config/prisma";
import { comparePassword } from "../../utils/password";
import { generateAccessToken } from "../../utils/jwt";
import { LoginInput } from "./auth.validation";

export async function loginAdmin(input: LoginInput) {
  const user = await prisma.user.findUnique({
    where: {
      email: input.email,
    },
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  if (user.status !== "ACTIVE") {
    throw new Error("User account is inactive");
  }

  if (user.role !== "ADMIN") {
    throw new Error("Access denied");
  }

  const passwordMatched = await comparePassword(
    input.password,
    user.password
  );

  if (!passwordMatched) {
    throw new Error("Invalid email or password");
  }

  const accessToken = generateAccessToken({
    userId: user.id,
    role: "ADMIN",
  });

  return {
    accessToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
}