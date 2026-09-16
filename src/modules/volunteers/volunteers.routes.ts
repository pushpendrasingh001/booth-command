import { Router } from "express";

import { authMiddleware } from "../../middleware/auth.middleware";

import {
  create,
  getAll,
  getOne,
  update,
  assign,
} from "./volunteers.controller";

const router = Router();

router.use(authMiddleware);

router.post("/", create);
router.get("/", getAll);
router.get("/:id", getOne);
router.patch("/:id", update);
router.patch("/:id/assign-booth", assign);

export default router;