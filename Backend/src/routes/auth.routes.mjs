import express from "express";
import {registerUser, loginUser, logoutUser} from "../controllers/auth.controller.mjs";
import {getAccessToken} from "../controllers/token.controller.mjs";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.post("/refresh", getAccessToken);
router.post("/logout", logoutUser);

export default router;
