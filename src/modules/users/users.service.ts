import { prisma } from "../../config/prisma";
import { hashPassword } from "../../utils/password";
import {
  CreateUserInput,
  UpdateUserInput,
} from "./users.validation";

export async function createUser(input: CreateUserInput) {
  const existingUser = await prisma.user.findUnique({
    where: {
      email: input.email,
    },
  });

  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  const hashedPassword = await hashPassword(input.password);

  return prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      password: hashedPassword,
      role: "ADMIN",
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function getUsers() {
  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getUserById(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}

export async function updateUser(
  id: string,
  input: UpdateUserInput
) {
  const existingUser = await prisma.user.findUnique({
    where: { id },
  });

  if (!existingUser) {
    throw new Error("User not found");
  }

  const data: {
    name?: string;
    email?: string;
    password?: string;
    status?: "ACTIVE" | "INACTIVE";
  } = {};

  if (input.name !== undefined) {
    data.name = input.name;
  }

  if (input.email !== undefined) {
    data.email = input.email;
  }

  if (input.password !== undefined) {
    data.password = await hashPassword(input.password);
  }

  if (input.status !== undefined) {
    data.status = input.status;
  }

  try {
    return await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  } catch (error: any) {
    if (error.code === "P2002") {
      throw new Error("Email already exists");
    }

    throw error;
  }
}