import express from "express";
import {getDashboardStats, getThemeTrends, askLoop} from "../controllers/analytics.controller.mjs";
import {protect} from "../middleware/auth.middleware.mjs";

const router = express.Router();

router.use(protect);

router.get("/dashboard", getDashboardStats);
router.get("/trends", getThemeTrends);
router.post("/ask", askLoop);

export default router;
