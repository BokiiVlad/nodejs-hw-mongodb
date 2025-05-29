import express from "express";
import pino from "pino-http";
import cors from "cors";
import dotenv from "dotenv";
import { getEnvVar } from "./utils/getEnvVar.js";
import { notFoundHandler } from "./middlewares/notFoundHandler.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import router from "./routers/index.js";
import cookieParser from "cookie-parser";


export const setupServer = async () => {
    dotenv.config();
    const app = express();
    const PORT = Number(getEnvVar("PORT", "3000"));
    app.use(express.json());
    app.use(cookieParser());
    app.use(pino({
        transport: {
            target: 'pino-pretty',
        },
    }),);
    app.use(router);
    app.use(cors());
    app.use(errorHandler);
    app.use(notFoundHandler);
    app.listen(PORT, (error) => {
        if (error) {
            throw error;
        }
        console.log(`Server is running on port ${PORT}`);
    });
};
