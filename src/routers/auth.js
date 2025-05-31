import { Router } from "express";
import { loginUserController, logoutUserController, refreshUserSessionController, registerUserController } from "../controllers/auth.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { validateBody } from "../middlewares/validateBody.js";
import { loginSchemaValidate, registerSchemaValidate } from "../validation/auth.js";

const router = Router();

router.post("/register", validateBody(registerSchemaValidate), ctrlWrapper(registerUserController));

router.post("/login", validateBody(loginSchemaValidate), ctrlWrapper(loginUserController));

router.post("/logout", ctrlWrapper(logoutUserController));

router.post("/refresh", ctrlWrapper(refreshUserSessionController));

export default router;