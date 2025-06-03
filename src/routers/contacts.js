import { Router } from "express";
import { getAllContactsController, getContactByIdController, createContactController, deleteContactController, patchContactController } from "../controllers/contacts.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { validateBody } from "../middlewares/validateBody.js";
import { contactSchemaValidate } from "../validation/student.js";
import { isValidId } from "../middlewares/isValidId.js";


const router = Router();

router.get("/", ctrlWrapper(getAllContactsController));

router.get("/:contactId", isValidId, ctrlWrapper(getContactByIdController));

router.post("/", validateBody(contactSchemaValidate), ctrlWrapper(createContactController));

router.delete("/:contactId", isValidId, ctrlWrapper(deleteContactController));

router.patch("/:contactId", isValidId, validateBody(contactSchemaValidate), ctrlWrapper(patchContactController));


export default router;
