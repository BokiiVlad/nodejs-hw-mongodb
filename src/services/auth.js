import createHttpError from "http-errors";
import { UserCollection } from "../db/models/user.js";
import bcrypt from "bcrypt";
import { randomBytes } from 'crypto';
import { FIFTEEN_MINUTES, ONE_DAY } from "../constants/index.js";
import { SessionCollection } from "../db/models/session.js";


export const registerUser = async (payload) => {
    const user = await UserCollection.findOne({ email: payload.email });
    if (user !== null) {
        throw new createHttpError.Conflict('Email in use');
    };
    const encryptedPassword = await bcrypt.hash(payload.password, 10);
    return UserCollection.create({ ...payload, password: encryptedPassword });
};

export const loginUser = async (payload) => {
    const user = await UserCollection.findOne({ email: payload.email });
    if (user === null) {
        throw new createHttpError.Unauthorized("Email or password is incorrect");
    }
    const isEqual = await bcrypt.compare(payload.password, user.password);

    if (!isEqual) {
        throw new createHttpError.Unauthorized("Email or password is incorrect");
    };

    await SessionCollection.deleteOne({ userId: user._id });
    const accessToken = randomBytes(30).toString('base64');
    const refreshToken = randomBytes(30).toString('base64');

    return await SessionCollection.create({
        userId: user._id,
        accessToken: accessToken,
        refreshToken: refreshToken,
        accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
        refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
    });
};

export const logoutUser = async (sessionId) => {
    await SessionCollection.deleteOne({ _id: sessionId });
};