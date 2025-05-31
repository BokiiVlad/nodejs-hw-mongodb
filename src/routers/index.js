import { Router } from "express";
import authRoutes from "../routers/auth.js";
import contactsRoutes from "../routers/contacts.js";
import { auth } from "../middlewares/authenticate.js";

const router = Router();

router.use('/auth', authRoutes);
router.use('/contacts', auth, contactsRoutes);

export default router;
