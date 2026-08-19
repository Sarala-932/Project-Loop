import jwt from "jsonwebtoken";
import {config} from "../config/config.mjs";

const generateToken = (userId, role, workspaceId) => {
    const accessToken = jwt.sign({userId, role, workspaceId}, config.jwtSecret, {
        expiresIn: config.accessTokenExpiry,
    });
    const refreshToken = jwt.sign({userId}, config.jwtRefreshSecret, {
        expiresIn: config.refreshTokenExpiry,
    });

    return {accessToken, refreshToken};
};

export default generateToken;
