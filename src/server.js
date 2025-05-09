import express from "express";
import pino from "pino-http";
import cors from "cors";
import dotenv from "dotenv";
import { getEnvVar } from "./src/utils/getEnvVar.js";

export const setupServer = async () => {
    dotenv.config();
    const app = express();
    const PORT = Number(getEnvVar("PORT", "3000"));

    app.use(pino({
        transport: {
            target: 'pino-pretty',
        },
    }),);

    app.use(cors());

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });

    app.use("*", (req, res, next) => {
        res.status(404).json(
            {
                message: 'Not found',
            }
        );
    });
};
