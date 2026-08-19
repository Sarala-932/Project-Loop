import express from "express";
import { submitPublicFeedback } from "../controllers/widget.controller.mjs";

const router = express.Router();

// No auth middleware! This is a public route for the widget.
router.post("/submit", submitPublicFeedback);

export default router;
