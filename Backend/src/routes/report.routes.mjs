import express from "express";
import { generateReport, getReports, getReportById } from "../controllers/report.controller.mjs";
import { protect } from "../middleware/auth.middleware.mjs";

const router = express.Router();

// All report routes require authentication
router.use(protect);

router.post("/generate", generateReport);
router.get("/", getReports);
router.get("/:id", getReportById);

export default router;
