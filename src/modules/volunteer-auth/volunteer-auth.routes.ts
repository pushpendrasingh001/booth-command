import { Router } from "express";

import { login } from "./volunteer-auth.controller";

const router = Router();

router.post("/login", login);

export default router;