import createHttpError from "http-errors";
import { UserCollection } from "../db/models/user.js";
import bcrypt from "bcrypt";
import path from "path";
import { randomBytes } from 'crypto';
import { FIFTEEN_MINUTES, ONE_DAY, TEMPLATES_DIR } from "../constants/index.js";
import { SessionCollection } from "../db/models/session.js";
import jwt from "jsonwebtoken";
import { getEnvVar } from "../utils/getEnvVar.js";
import { sendEmail } from "../utils/sendMail.js";
import * as fs from "node:fs/promises";
import { SMTP } from "../constants/index.js";
import handlebars from 'handlebars';

export const resetPassword = async (payload) => {
    let entries;

    try {
        entries = jwt.verify(payload.token, getEnvVar("JWT_SECRET"));
    } catch (error) {
        if (error instanceof Error) {
            throw new createHttpError.Unauthorized("Token is expired or invalid.");
        };
        throw error;
    }
    const user = await UserCollection.findOne({
        email: entries.email,
        _id: entries.sub,
    });
    console.log(entries.email);
    console.log(entries.sub);

    if (!user) {
        throw new createHttpError(404, "User not found!");
    }

    const encryptedPassword = await bcrypt.hash(payload.password, 10);

    await UserCollection.updateOne(
        { _id: user._id },
        { password: encryptedPassword }
    );
    await SessionCollection.deleteOne({ _id: user._id });
};

export const resetUserEmail = async (email) => {
    const user = await UserCollection.findOne({ email });
    if (user === null) {
        throw new createHttpError.NotFound("User not found!");
    };
    const tokenJwt = jwt.sign(
        {
            sub: user._id,
            name: user.name,
            email: user.email
        },
        getEnvVar("JWT_SECRET"),
        {
            expiresIn: '5m',
        },
    );

    // Шаблонізатор
    const resetPasswordTemplatePath = path.join(
        TEMPLATES_DIR,
        'reset-password-email.html',
    );

    const templateSource = (
        await fs.readFile(resetPasswordTemplatePath)
    ).toString();

    const template = handlebars.compile(templateSource);
    const html = template({
        name: user.name,
        link: `${getEnvVar('APP_DOMAIN')}/reset-password?token=${tokenJwt}`,
    });

    try {
        await sendEmail({
            from: getEnvVar(SMTP.SMTP_FROM),
            to: email,
            secure: false,
            subject: 'Reset your password',
            html,
        });

    } catch (error) {
        console.log(error);
        throw createHttpError.InternalServerError("Failed to send the email, please try again later.");
    }

};


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

export const refreshSession = async (sessionId, refreshToken) => {
    const session = await SessionCollection.findOne({ _id: sessionId });

    if (session === null) {
        throw new createHttpError.Unauthorized("Session not found");
    };

    if (session.refreshToken !== refreshToken) {
        throw new createHttpError.Unauthorized("Refresh token is invalid");
    };

    if (session.refreshTokenValidUntil < new Date()) {
        throw new createHttpError.Unauthorized("Refresh token is expired");
    };

    await SessionCollection.deleteOne({ _id: session._id });

    return await SessionCollection.create({
        userId: session.userId,
        accessToken: randomBytes(30).toString('base64'),
        refreshToken: randomBytes(30).toString('base64'),
        accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
        refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
    });
};