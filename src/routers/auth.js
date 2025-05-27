import { Router } from "express";
import { registerUserController } from "../controllers/auth.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { validateBody } from "../middlewares/validateBody.js";
import { registerSchemaValidate } from "../validation/auth.js";

const router = Router();

router.post("/register", validateBody(registerSchemaValidate), ctrlWrapper(registerUserController));

export default router;