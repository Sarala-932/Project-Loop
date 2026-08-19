import mongoose from "mongoose";

const userRoles = [
    "ADMIN",
    "ANALYST",
    "VIEWER",
];

const userSchema = new mongoose.Schema(
    {
        workspaceId: {type: mongoose.Schema.Types.ObjectId, ref: "Workspace", required: true},
        name: {type: String, required: true},
        email: {type: String, required: true, unique: true, lowercase: true, trim: true},
        passwordHash: {type: String, required: true},
        role: {type: String, enum: userRoles, default: "VIEWER"},
    },
    {timestamps: true}
);

userSchema.index({workspaceId: 1, email: 1});

const User = mongoose.model("User", userSchema);

export default User;
