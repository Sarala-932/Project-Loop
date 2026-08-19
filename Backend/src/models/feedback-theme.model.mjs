import mongoose from "mongoose";

const feedbackThemeSchema = new mongoose.Schema(
    {
        feedbackId: {type: mongoose.Schema.Types.ObjectId, ref: "Feedback", required: true},
        themeId: {type: mongoose.Schema.Types.ObjectId, ref: "Theme", required: true},
        confidence: {type: Number, min: 0, max: 1},
    },
    {timestamps: true}
);

feedbackThemeSchema.index({feedbackId: 1, themeId: 1}, {unique: true});

const FeedbackTheme = mongoose.model("FeedbackTheme", feedbackThemeSchema);

export default FeedbackTheme;
