import { Router } from "express";
import { getAllContactsController, getContactByIdController, createContactController, deleteContactController, patchContactController } from "../controllers/contacts.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { validateBody } from "../middlewares/validateBody.js";
import { contactSchemaValidete } from "../validation/student.js";
import { isValidId } from "../middlewares/isValidId.js";


const router = Router();

router.get("/contacts", ctrlWrapper(getAllContactsController));

router.get("/contacts/:contactId", isValidId, ctrlWrapper(getContactByIdController));

router.post("/contacts", validateBody(contactSchemaValidete), ctrlWrapper(createContactController));

router.delete("/contacts/:contactId", isValidId, ctrlWrapper(deleteContactController));

router.patch("/contacts/:contactId", isValidId, validateBody(contactSchemaValidete), ctrlWrapper(patchContactController));


export default router;
