import {getAccessTokenService} from "../services/auth.service.mjs";

const isProd = process.env.NODE_ENV === "production";

export const accessCookieOpts = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 15 * 60 * 1000, // 15 minutes
};

export const refreshCookieOpts = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export const getAccessToken = async (req, res) => {
    try {
        const refreshToken = req.cookies?.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({message: "No refresh token, please login again"});
        }

        const {accessToken, user} = await getAccessTokenService(refreshToken);

        res.cookie("accessToken", accessToken, accessCookieOpts);
        
        res.status(200).json({message: "Token refreshed successfully", user: {id: user._id, name: user.name, email: user.email, role: user.role, workspaceId: user.workspaceId}});
    } catch (error) {
        res.status(error.statusCode || 500).json({message: error.message});
    }
};
