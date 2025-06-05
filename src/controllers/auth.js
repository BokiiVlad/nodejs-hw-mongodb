import { ONE_DAY } from "../constants/index.js";
import { loginUser, logoutUser, refreshSession, registerUser, resetPassword, resetUserEmail } from "../services/auth.js";

export const resetPasswordController = async (req, res) => {
    await resetPassword(req.body);

    res.status(200).json({
        status: 200,
        message: "Password has been successfully reset.",
        data: {}
    }
    );
};

export const requestResetPasswordController = async (req, res) => {
    await resetUserEmail(req.body.email);

    res.status(200).json({
        status: 200,
        message: "Reset password email has been successfully sent.",
        data: {}
    });

};

export const registerUserController = async (req, res) => {
    const user = await registerUser(req.body);
    res.status(201).json({
        status: 201,
        message: "Successfully registered a user!",
        data: user,
    });

};

export const loginUserController = async (req, res) => {
    const session = await loginUser(req.body);

    res.cookie("refreshToken", session.refreshToken, {
        httpOnly: true,
        expires: new Date(Date.now() + ONE_DAY)
    });
    res.cookie("sessionId", session._id, {
        httpOnly: true,
        expires: new Date(Date.now() + ONE_DAY)
    });


    res.status(201).json({
        status: 201,
        message: "Successfully logged in an user!",
        data: {
            accessToken: session.accessToken,
        },
    });
};

export const logoutUserController = async (req, res) => {
    if (req.cookies.sessionId) {
        await logoutUser(req.cookies.sessionId);
    };

    res.clearCookie("sessionId");
    res.clearCookie("refreshToken");
    res.status(204).end();
};

export const refreshUserSessionController = async (req, res) => {
    const { sessionId, refreshToken } = req.cookies;
    const session = await refreshSession(sessionId, refreshToken);

    res.cookie("refreshToken", session.refreshToken, {
        httpOnly: true,
        expires: new Date(Date.now() + ONE_DAY)
    });
    res.cookie("sessionId", session._id, {
        httpOnly: true,
        expires: new Date(Date.now() + ONE_DAY)
    });

    res.status(200).json({
        status: 200,
        message: "Successfully refreshed a session!",
        data: {
            accessToken: session.accessToken,
        },
    });
};
