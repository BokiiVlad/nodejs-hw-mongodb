import { Router } from "express";
import authRoutes from "../routers/auth.js";
import contactsRoutes from "../routers/contacts.js";

const router = Router();

router.use('/auth', authRoutes);
router.use('/contacts', contactsRoutes);

export default router;
