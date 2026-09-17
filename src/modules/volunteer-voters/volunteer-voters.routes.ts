import { Router } from "express";
import { volunteerAuthMiddleware } from "../../middleware/volunteer-auth.middleware";
import {
  getVoters,
  updateVoter,
} from "./volunteer-voters.controller";

const router = Router();

router.use(volunteerAuthMiddleware);

router.get("/", getVoters);

router.patch("/:id", updateVoter);

export default router;