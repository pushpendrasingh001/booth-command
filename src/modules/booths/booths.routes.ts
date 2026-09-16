import { Router } from "express";

import { authMiddleware } from "../../middleware/auth.middleware";

import {
  create,
  getAll,
  getOne,
  update,
} from "./booths.controller";

const router = Router();

router.use(authMiddleware);

router.post("/", create);
router.get("/", getAll);
router.get("/:id", getOne);
router.patch("/:id", update);

export default router;