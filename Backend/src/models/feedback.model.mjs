import mongoose from "mongoose";

const feedbackStatuses = ["NEW", "REVIEWED", "ACTIONED"];
const sentimentTypes = ["POS", "NEU", "NEG"];

const feedbackSchema = new mongoose.Schema(
    {
        workspaceId: {type: mongoose.Schema.Types.ObjectId, ref: "Workspace", required: true},
        content: {type: String, required: true},
        channel: {type: String, required: true},
        sourceRef: {type: String},
        customerLabel: {type: String},
        sentiment: {type: String, enum: sentimentTypes},
        sentimentScore: {type: Number, min: -1, max: 1},
        status: {type: String, enum: feedbackStatuses, default: "NEW"},
        themes: [{type: mongoose.Schema.Types.ObjectId, ref: "Theme"}],
    },
    {timestamps: true}
);

feedbackSchema.index({workspaceId: 1, status: 1});
feedbackSchema.index({workspaceId: 1, channel: 1});

const Feedback = mongoose.model("Feedback", feedbackSchema);

export default Feedback;
