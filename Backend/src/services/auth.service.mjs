import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/user.model.mjs";
import Workspace from "../models/workspace.model.mjs";
import RefreshToken from "../models/refresh-token.model.mjs";
import createError from "../utils/createError.mjs";
import {config} from "../config/config.mjs";
import generateToken from "../utils/generateToken.mjs";

export const registerUserService = async (companyName, name, email, password) => {
    if (!companyName || !name || !email || !password) {
        throw createError("companyName, name, email, and password are required", 400);
    }
    if (password.length < 8) {
        throw createError("Password must be at least 8 characters", 400);
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw createError("Please provide a valid email address", 400);
    }

    const existingUser = await User.findOne({email});
    if (existingUser) {
        throw createError("User with this email already exists", 400);
    }

    const workspace = await Workspace.create({name: companyName});
    
    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
        workspaceId: workspace._id,
        name,
        email,
        passwordHash,
        role: "ADMIN",
    });

    const {accessToken, refreshToken} = generateToken(user._id, user.role, workspace._id);

    await RefreshToken.create({
        userId: user._id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    return {accessToken, refreshToken, user};
};

export const loginUserService = async (email, password) => {
    if (!email || !password) {
        throw createError("Email and password are required", 400);
    }

    const user = await User.findOne({email});
    if (!user) throw createError("Invalid credentials", 401);

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) throw createError("Invalid credentials", 401);

    const {accessToken, refreshToken} = generateToken(user._id, user.role, user.workspaceId);

    await RefreshToken.create({
        userId: user._id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    return {accessToken, refreshToken, user};
};

export const logoutService = async (refreshToken) => {
    if (refreshToken) {
        await RefreshToken.findOneAndDelete({token: refreshToken});
    }
};

export const getAccessTokenService = async (refreshToken) => {
    if (!refreshToken) {
        throw createError("Refresh token not found, please login again", 401);
    }

    // Verify the refresh token
    let decoded;
    try {
        decoded = jwt.verify(refreshToken, config.jwtRefreshSecret);
    } catch (error) {
        throw createError("Invalid or expired refresh token, please login again", 401);
    }

    // Check if refresh token exists in database (not revoked)
    const storedToken = await RefreshToken.findOne({token: refreshToken});
    if (!storedToken) {
        throw createError("Refresh token has been revoked, please login again", 401);
    }

    // Get fresh user data for the new token
    const user = await User.findById(decoded.userId);
    if (!user) {
        throw createError("User not found", 401);
    }

    const {accessToken} = generateToken(user._id, user.role, user.workspaceId);

    return {accessToken};
};
