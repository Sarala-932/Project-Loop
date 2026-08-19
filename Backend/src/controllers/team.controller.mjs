import {
    getTeamMembersService,
    inviteMemberService,
    updateMemberRoleService,
    removeMemberService
} from "../services/team.service.mjs";

export const getTeamMembers = async (req, res) => {
    try {
        const members = await getTeamMembersService(req.user.workspaceId);
        res.status(200).json({ members });
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

export const inviteMember = async (req, res) => {
    try {
        const member = await inviteMemberService(req.user.workspaceId, req.body);
        res.status(201).json({
            message: "Member invited successfully",
            member,
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

export const updateMemberRole = async (req, res) => {
    try {
        const member = await updateMemberRoleService(
            req.user.workspaceId,
            req.user.userId,
            req.params.id,
            req.body.role
        );
        res.status(200).json({ message: "Role updated successfully", member });
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

export const removeMember = async (req, res) => {
    try {
        await removeMemberService(req.user.workspaceId, req.user.userId, req.params.id);
        res.status(200).json({ message: "Member removed successfully" });
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};
