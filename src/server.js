import express from "express";
import pino from "pino-http";
import cors from "cors";
import dotenv from "dotenv";
import { getEnvVar } from "./utils/getEnvVar.js";
import { getAllContacts, getContactById } from "./services/contacts.js";


export const setupServer = async () => {
    dotenv.config();
    const app = express();
    const PORT = Number(getEnvVar("PORT", "3000"));

    app.use(express.json());
    app.use(pino({
        transport: {
            target: 'pino-pretty',
        },
    }),);

    app.use(cors());

    app.get("/contacts", async (req, res, next) => {
        const contacts = await getAllContacts();
        res.status(200).json({
            status: 200,
            message: "Successfully found contacts!",
            data: contacts,
        });
    });

    app.get("/contacts/:contactId", async (req, res, next) => {
        const { contactId } = req.params;
        const contact = await getContactById(contactId);
        if (!contact) {
            res.status(404).json({
                message: 'Contact not found',
            });
            return;
        };
        res.status(200).json({
            status: 200,
            message: "Successfully found contact with id {contactId}!",
            data: contact,
        }
        );
    });

    app.listen(PORT, (error) => {
        if (error) {
            throw error;
        }
        console.log(`Server is running on port ${PORT}`);
    });

    app.use((req, res, next) => {
        res.status(404).json(
            {
                message: 'Not found',
            }
        );
    });
};
