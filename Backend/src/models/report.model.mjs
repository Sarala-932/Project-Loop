import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
    {
        workspaceId: {type: mongoose.Schema.Types.ObjectId, ref: "Workspace", required: true},
        generatedBy: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
        title: {type: String, required: true},
        periodStart: {type: Date, required: true},
        periodEnd: {type: Date, required: true},
        stats: {type: mongoose.Schema.Types.Mixed, required: true},
        narrative: {type: String, required: true},
    },
    {timestamps: true}
);

reportSchema.index({workspaceId: 1, periodStart: -1});

const Report = mongoose.model("Report", reportSchema);

export default Report;
