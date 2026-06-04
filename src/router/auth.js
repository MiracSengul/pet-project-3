import { Router } from "express";
import {
  loginController,
  logoutController,
  refreshController,
  registerController,
} from "../controller/auth.js";
import ctrlWrapper from "../utils/ctrlWrapper.js";
import { validateBody } from "../middleware/validateBody.js";
import { createUserSchema, loginSchema } from "../validation/auth.js";
import { authenticate } from "../middleware/authenticate.js";

const router = Router();

router.post(
  "/register",
  validateBody(createUserSchema),
  ctrlWrapper(registerController),
);
router.post("/login", validateBody(loginSchema), ctrlWrapper(loginController));
router.get("/logout", authenticate, ctrlWrapper(logoutController));
router.get("/refresh", authenticate, ctrlWrapper(refreshController));

export default router;