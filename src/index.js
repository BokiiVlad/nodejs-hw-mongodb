import { setupServer } from "./server.js";
import { initMongoDB } from "./db/initMongoConnection.js";

const startApp = async () => {
    await initMongoDB();
    setupServer();
};

startApp();
