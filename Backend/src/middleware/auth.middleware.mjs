import jwt from "jsonwebtoken";
import {config} from "../config/config.mjs";

export const protect = (req, res, next) => {
    try {
        const accessToken = req.cookies?.accessToken;

        if (!accessToken) {
            return res.status(401).json({message: "Unauthorized — no token"});
        }

        const decoded = jwt.verify(accessToken, config.jwtSecret);

        req.user = decoded;

        next();
    } catch (error) {
        const msg = error.name === "TokenExpiredError" ? "Access token expired" : "Invalid access token";
        return res.status(401).json({message: msg, code: error.name});
    }
};

/**
 * RBAC Middleware (Checks if user has required roles)
 * Usage: router.get("/route", protect, restrictTo("ADMIN", "ANALYST"),    handler)
 **/
export const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res
                .status(403)
                .json({message: "Forbidden: You do not have permission to perform this action"});
        }
        next();
    };
};
