import {registerUserService, loginUserService, logoutService} from "../services/auth.service.mjs";

import {accessCookieOpts, refreshCookieOpts} from "./token.controller.mjs";

export const registerUser = async (req, res) => {
    try {
        const {companyName, name, email, password} = req.body;
        const {accessToken, refreshToken, user} = await registerUserService(
            companyName,
            name,
            email,
            password,
        );

        res.cookie("accessToken", accessToken, accessCookieOpts);
        res.cookie("refreshToken", refreshToken, refreshCookieOpts);

        res.status(201).json({
            message: "Workspace and Admin account created successfully",
            user: {id: user._id, name: user.name, role: user.role, workspaceId: user.workspaceId},
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({message: error.message});
    }
};

export const loginUser = async (req, res) => {
    try {
        const {email, password} = req.body;

        const {accessToken, refreshToken, user} = await loginUserService(email, password);

        res.cookie("accessToken", accessToken, accessCookieOpts);

        res.cookie("refreshToken", refreshToken, refreshCookieOpts);

        res.status(200).json({
            message: "Logged in successfully",
            user: {id: user._id, name: user.name, role: user.role, workspaceId: user.workspaceId},
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({message: error.message});
    }
};

export const logoutUser = async (req, res) => {
    try {
        const refreshToken = req.cookies?.refreshToken;

        await logoutService(refreshToken);

        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        res.status(200).json({message: "Logged out successfully"});
    } catch (error) {
        res.status(error.statusCode || 500).json({message: error.message});
    }
};
