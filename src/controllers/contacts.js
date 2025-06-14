import { getAllContacts, getContactById, createContact, deleteContact, patchContact } from "../services/contacts.js";
import createHttpError from "http-errors";
import { parsePaginationParams } from "../utils/parsePaginationParams.js";
import { parseSortParams } from "../utils/parseSortParams.js";
import { parseFilterParams } from "../utils/parseFilterParams.js";
import { saveFileToCloudinary } from "../utils/saveFileToCloudinary.js";
import { getEnvVar } from "../utils/getEnvVar.js";
import { saveFileToUploadDir } from "../utils/saveFileToUploadDir.js";
import * as fs from "node:fs/promises";

export const getAllContactsController = async (req, res) => {
    const { page, perPage } = parsePaginationParams(req.query);
    const { sortBy, sortOrder } = parseSortParams(req.query);
    const filter = parseFilterParams(req.query);

    const contacts = await getAllContacts({ page, perPage, sortBy, sortOrder, filter, userId: req.user.id });

    res.status(200).json({
        "status": 200,
        "message": "Successfully found contacts!",
        "data": contacts,
    });
};


export const getContactByIdController = async (req, res, next) => {
    const { contactId } = req.params;
    const contact = await getContactById({ _id: contactId, userId: req.user.id });
    if (!contact) {
        return next(createHttpError(404, "Contact not found"));
    };

    if (contact.ownerId.toString() !== req.user.id.toString()) {
        throw new createHttpError.NotFound('Student not found');
    }

    res.status(200).json({
        status: 200,
        message: `Successfully found contact with id ${contactId}!`,
        data: contact,
    }
    );
};

export const createContactController = async (req, res) => {
    const body = req.body;
    let photo = null;
    console.log(req.file);

    if (getEnvVar('ENABLE_CLOUDINARY') === 'true') {
        // Записує в хмару
        photo = await saveFileToCloudinary(req.file);
    } else {
        photo = await saveFileToUploadDir(req.file);
    }
    const contact = await createContact({ ...body, userId: req.user.id, photo });


    res.status(201).json({
        status: 201,
        message: "Successfully created a contact!",
        data: contact,
    });
};

export const deleteContactController = async (req, res, next) => {
    const { contactId } = req.params;
    const contact = await deleteContact({ _id: contactId, userId: req.user.id });
    if (!contact) {
        return next(createHttpError(404, "Contact not found"));
    }

    res.status(204).end();
};

export const patchContactController = async (req, res, next) => {
    const { contactId } = req.params;
    const photo = req.file;
    let urlPhoto;

    if (photo) {
        if (getEnvVar("ENABLE_CLOUDINARY") === "true") {
            urlPhoto = await saveFileToCloudinary(photo);
        } else { urlPhoto = await saveFileToUploadDir(photo); };
    };

    const contact = await patchContact({ _id: contactId, userId: req.user.id }, { ...req.body, photo: urlPhoto });

    if (!contact) {
        return next(createHttpError(404, "Contact not found"));
    }

    res.status(200).json({
        status: 200,
        message: "Successfully patched a contact!",
        data: contact,
    });
};