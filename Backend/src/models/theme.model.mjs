import mongoose from "mongoose";

const themeSchema = new mongoose.Schema(
    {
        workspaceId: {type: mongoose.Schema.Types.ObjectId, ref: "Workspace", required: true},
        name: {type: String, required: true},
        description: {type: String},
        color: {type: String},
    },
    {timestamps: true},
);

themeSchema.index({workspaceId: 1, name: 1}, {unique: true});
const Theme = mongoose.model("Theme", themeSchema);

export default Theme;
