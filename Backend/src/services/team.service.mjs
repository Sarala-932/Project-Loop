import User from "../models/user.model.mjs";
import bcrypt from "bcrypt";
import createError from "../utils/createError.mjs";

export const getTeamMembersService = async (workspaceId) => {
    return await User.find({ workspaceId }).select("-passwordHash").sort({ createdAt: 1 });
};

export const inviteMemberService = async (workspaceId, { name, email, password, role }) => {
    if (!name || !email || !password) {
        throw createError("Name, email, and password are required", 400);
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw createError("A user with this email already exists", 400);
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const member = await User.create({
        workspaceId,
        name,
        email,
        passwordHash,
        role: role || "VIEWER",
    });

    return {
        _id: member._id,
        name: member.name,
        email: member.email,
        role: member.role,
        createdAt: member.createdAt,
    };
};

export const updateMemberRoleService = async (workspaceId, reqUserId, targetId, role) => {
    if (!["ADMIN", "ANALYST", "VIEWER"].includes(role)) {
        throw createError("Invalid role", 400);
    }

    if (targetId === reqUserId) {
        throw createError("You cannot change your own role", 403);
    }

    const member = await User.findOneAndUpdate(
        { _id: targetId, workspaceId },
        { role },
        { new: true, select: "-passwordHash" },
    );

    if (!member) throw createError("Member not found", 404);

    return member;
};

export const removeMemberService = async (workspaceId, reqUserId, targetId) => {
    // Prevent admin from deleting themselves
    if (targetId === reqUserId) {
        throw createError("You cannot remove yourself", 403);
    }

    const member = await User.findOneAndDelete({ _id: targetId, workspaceId });
    if (!member) throw createError("Member not found", 404);

    return member;
};
