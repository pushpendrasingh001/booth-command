import { Request, Response } from "express";
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
} from "./users.service";
import {
  createUserSchema,
  updateUserSchema,
} from "./users.validation";

export async function create(req: Request, res: Response) {
  try {
    const input = createUserSchema.parse(req.body);

    const user = await createUser(input);

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: { user },
    });
  } catch (error) {
    console.error(error);

    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create user",
    });
  }
}

export async function getAll(_req: Request, res: Response) {
  try {
    const users = await getUsers();

    return res.status(200).json({
      success: true,
      data: { users },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
}

export async function getOne(req: Request, res: Response) {
  try {

    const user = await getUserById(String(req.params.id));

    return res.status(200).json({
      success: true,
      data: { user },
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "User not found",
    });
  }
}

export async function update(req: Request, res: Response) {
  try {
    const input = updateUserSchema.parse(req.body);

   const user = await updateUser(String(req.params.id), input);

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: { user },
    });
  } catch (error) {
    console.error(error);

    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update user",
    });
  }
}


