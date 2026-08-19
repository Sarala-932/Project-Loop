import { createFeedbackService } from "../services/feedback.service.mjs";
import mongoose from "mongoose";

export const submitPublicFeedback = async (req, res) => {
    try {
        const { workspaceId, content, rating, source } = req.body;

        // Simple validation
        if (!workspaceId || !mongoose.Types.ObjectId.isValid(workspaceId)) {
            return res.status(400).json({ message: "Invalid workspace ID" });
        }
        if (!content) {
            return res.status(400).json({ message: "Feedback content is required" });
        }

        // Call the existing service. We pass 'workspaceId' directly.
        await createFeedbackService(workspaceId, {
            text: content,
            channel: source || "WIDGET"
        });

        res.status(201).json({ message: "Feedback submitted successfully" });
    } catch (error) {
        console.error("Widget Submission Error:", error.message);
        res.status(error.statusCode || 500).json({ message: error.message || "Failed to submit feedback" });
    }
};
