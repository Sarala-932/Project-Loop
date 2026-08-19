import express from "express";
import { getTeamMembers, inviteMember, updateMemberRole, removeMember } from "../controllers/team.controller.mjs";
import { protect, restrictTo } from "../middleware/auth.middleware.mjs";

const router = express.Router();

router.use(protect);

router.get("/", getTeamMembers);                                          // All roles can see members
router.post("/invite", restrictTo("ADMIN"), inviteMember);               // Only Admin can invite
router.patch("/:id/role", restrictTo("ADMIN"), updateMemberRole);        // Only Admin can change roles
router.delete("/:id", restrictTo("ADMIN"), removeMember);                // Only Admin can remove

export default router;
