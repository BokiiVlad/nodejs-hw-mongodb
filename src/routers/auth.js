import { Router } from "express";
import { getGoogleOAuthUrlController, loginUserController, loginWithGoogleController, logoutUserController, refreshUserSessionController, registerUserController, requestResetPasswordController, resetPasswordController } from "../controllers/auth.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { validateBody } from "../middlewares/validateBody.js";
import { loginSchemaValidate, loginWithGoogleOAuthSchema, registerSchemaValidate, requestResetEmailSchema, resetPasswordSchema } from "../validation/auth.js";

const router = Router();

router.post("/confirm-oauth", validateBody(loginWithGoogleOAuthSchema), ctrlWrapper(loginWithGoogleController));

router.get("/get-oauth-url", ctrlWrapper(getGoogleOAuthUrlController));

router.post("/reset-pwd", validateBody(resetPasswordSchema), ctrlWrapper(resetPasswordController));

router.post("/send-reset-email", validateBody(requestResetEmailSchema), ctrlWrapper(requestResetPasswordController));

router.post("/register", validateBody(registerSchemaValidate), ctrlWrapper(registerUserController));

router.post("/login", validateBody(loginSchemaValidate), ctrlWrapper(loginUserController));

router.post("/logout", ctrlWrapper(logoutUserController));

router.post("/refresh", ctrlWrapper(refreshUserSessionController));

export default router;