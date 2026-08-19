import express from "express";
import {
    createFeedback,
    getFeedbacks,
    getFeedbackById,
    updateFeedback,
    deleteFeedback,
    uploadFeedbacks,
    reclassifyFeedback,
    backfillClassifications,
} from "../controllers/feedback.controller.mjs";
import {protect, restrictTo} from "../middleware/auth.middleware.mjs";
import upload from "../middleware/upload.middleware.mjs";

const router = express.Router();

/** ALL feedback routes require the user to be logged in */

router.use(protect);

/** CREATE - Only Admin & Analyst can add feedback (Viewer is read-only) */

router.post("/", restrictTo("ADMIN", "ANALYST"), createFeedback);
router.post("/upload", restrictTo("ADMIN", "ANALYST"), upload.single("file"), uploadFeedbacks);

/** AI CLASSIFICATION ROUTES - Admin & Analyst only */
router.post("/backfill", restrictTo("ADMIN", "ANALYST"), backfillClassifications);
router.post("/:id/reclassify", restrictTo("ADMIN", "ANALYST"), reclassifyFeedback);

/** READ - All roles (Admin, Analyst, Viewer) can read feedback */

router.get("/", getFeedbacks);
router.get("/:id", getFeedbackById);

/** UPDATE & DELETE - Only Admin & Analyst */

router.put("/:id", restrictTo("ADMIN", "ANALYST"), updateFeedback);
router.delete("/:id", restrictTo("ADMIN", "ANALYST"), deleteFeedback);

export default router;
