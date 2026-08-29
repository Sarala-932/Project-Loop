import express from "express";
import {registerUser, loginUser, logoutUser, getMe} from "../controllers/auth.controller.mjs";
import {getAccessToken} from "../controllers/token.controller.mjs";
import {protect} from "../middleware/auth.middleware.mjs";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.post("/refresh", getAccessToken);
router.post("/logout", logoutUser);

router.get("/get-me", protect, getMe);

export default router;
