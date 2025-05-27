import createHttpError from "http-errors";
import { UserCollection } from "../db/models/user.js";
import bcrypt from "bcrypt";


export const registerUser = async (payload) => {
    const user = await UserCollection.findOne({ email: payload.email });
    if (user !== null) {
        throw new createHttpError.Conflict('Email in use');
    };
    const encryptedPassword = await bcrypt.hash(payload.password, 10);
    return UserCollection.create({ ...payload, password: encryptedPassword });

};