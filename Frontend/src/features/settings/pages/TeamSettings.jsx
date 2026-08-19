import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { Users, UserPlus, Search, Shield, Mail, Trash2, Loader2, X, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../auth/hooks/useAuth";
import { api } from "../../../lib/api";
import { toast } from "sonner";
import { RoleGate } from "../../../components/RoleGate";

const ROLE_STYLES = {
    ADMIN: "bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-500/20",
    ANALYST: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20",
    VIEWER: "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200/60 dark:border-zinc-700",
};

export const TeamSettings = () => {
    const { user: currentUser } = useAuth();
    const [members, setMembers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleOpenInvite = () => {
        setShowInviteModal(true);
        setIsClosing(false);
    };

    const handleCloseInvite = () => {
        setIsClosing(true);
        setTimeout(() => {
            setShowInviteModal(false);
            setIsClosing(false);
            setForm({ name: "", email: "", password: "", role: "VIEWER" });
        }, 280);
    };
    const [showPassword, setShowPassword] = useState(false);
    const [form, setForm] = useState({ name: "", email: "", password: "", role: "VIEWER" });

    const fetchMembers = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await api.get("/team");
            setMembers(res.data.members || []);
        } catch {
            toast.error("Failed to load team members.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => { fetchMembers(); }, [fetchMembers]);

    const filteredMembers = members.filter(m =>
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleRoleChange = async (id, newRole) => {
        const prev = members.find(m => m._id === id)?.role;
        // Optimistic update
        setMembers(prev => prev.map(m => m._id === id ? { ...m, role: newRole } : m));
        try {
            await api.patch(`/team/${id}/role`, { role: newRole });
            toast.success("Role updated successfully!");
        } catch (err) {
            // Revert on failure
            setMembers(prev => prev.map(m => m._id === id ? { ...m, role: prev } : m));
            toast.error(err.response?.data?.message || "Failed to update role.");
        }
    };

    const [deleteModal, setDeleteModal] = useState({ isOpen: false, member: null, isClosing: false });
    const [isRemoving, setIsRemoving] = useState(false);

    const handleOpenDelete = (member) => {
        setDeleteModal({ isOpen: true, member, isClosing: false });
    };

    const handleCloseDelete = () => {
        setDeleteModal(prev => ({ ...prev, isClosing: true }));
        setTimeout(() => {
            setDeleteModal({ isOpen: false, member: null, isClosing: false });
        }, 280);
    };

    const confirmRemove = async () => {
        if (!deleteModal.member) return;
        setIsRemoving(true);
        try {
            await toast.promise(
                api.delete(`/team/${deleteModal.member._id}`),
                { loading: "Removing member...", success: "Member removed!", error: "Failed to remove member." }
            );
            setMembers(prev => prev.filter(m => m._id !== deleteModal.member._id));
            handleCloseDelete();
        } catch { /* handled by toast.promise */ } finally {
            setIsRemoving(false);
        }
    };

    const handleInvite = async (e) => {
        e.preventDefault();
        if (!form.name || !form.email || !form.password) {
            toast.error("All fields are required.");
            return;
        }
        setIsSubmitting(true);
        try {
            const res = await api.post("/team/invite", form);
            setMembers(prev => [...prev, res.data.member]);
            toast.success(`${form.name} has been invited!`);
            handleCloseInvite();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to invite member.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500">

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight flex items-center gap-2">
                        <Users size={24} className="text-emerald-600" /> Team Settings
                    </h1>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                        Manage your workspace members and their access levels.
                    </p>
                </div>
                <RoleGate allowedRoles={["ADMIN"]}>
                    <button
                        onClick={handleOpenInvite}
                        className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-emerald-700 transition-all shadow-[0_2px_20px_rgb(0,0,0,0.04)] dark:shadow-none shadow-emerald-500/20 shrink-0"
                    >
                        <UserPlus size={16} /> Invite Member
                    </button>
                </RoleGate>
            </div>

            {/* Table Card */}
            <div className="bg-white dark:bg-zinc-900/40 dark:backdrop-blur-xl border border-zinc-200/60 dark:border-zinc-800 rounded-2xl shadow-[0_2px_20px_rgb(0,0,0,0.04)] dark:shadow-none overflow-hidden">
                {/* Search Bar */}
                <div className="p-4 border-b border-zinc-200/60 dark:border-zinc-800">
                    <div className="relative max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search members..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200/60 dark:border-zinc-700 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none text-zinc-900 dark:text-white transition-all"
                        />
                    </div>
                </div>

                {/* Members Table */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-16">
                        <Loader2 className="animate-spin text-emerald-500" size={32} />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200/60 dark:border-zinc-800">
                                    <th className="px-6 py-3 text-xs font-bold text-zinc-500 uppercase tracking-wider">Member</th>
                                    <th className="px-6 py-3 text-xs font-bold text-zinc-500 uppercase tracking-wider">Role</th>
                                    <th className="px-6 py-3 text-xs font-bold text-zinc-500 uppercase tracking-wider">Joined</th>
                                    <th className="px-6 py-3 text-xs font-bold text-zinc-500 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                                {filteredMembers.map(member => (
                                    <tr key={member._id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold text-sm border border-emerald-200 dark:border-emerald-800 shrink-0">
                                                    {member.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-sm text-zinc-900 dark:text-white flex items-center gap-2">
                                                        {member.name}
                                                        {member._id === currentUser?.id && (
                                                            <span className="text-xs bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full font-semibold border border-blue-200 dark:border-blue-500/20">You</span>
                                                        )}
                                                    </div>
                                                    <div className="text-xs text-zinc-500 flex items-center gap-1 mt-0.5">
                                                        <Mail size={11} /> {member.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {currentUser?.role === "ADMIN" && member._id !== currentUser?.id ? (
                                                <div className="flex items-center gap-1.5">
                                                    <Shield size={13} className={member.role === "ADMIN" ? "text-rose-500" : member.role === "ANALYST" ? "text-emerald-500" : "text-zinc-400"} />
                                                    <select
                                                        value={member.role}
                                                        onChange={e => handleRoleChange(member._id, e.target.value)}
                                                        className="bg-transparent text-sm font-semibold text-zinc-700 dark:text-zinc-300 outline-none cursor-pointer hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                                                    >
                                                        <option value="ADMIN">Admin</option>
                                                        <option value="ANALYST">Analyst</option>
                                                        <option value="VIEWER">Viewer</option>
                                                    </select>
                                                </div>
                                            ) : (
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${ROLE_STYLES[member.role]}`}>
                                                    <Shield size={11} /> {member.role}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-zinc-500">
                                                {new Date(member.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <RoleGate allowedRoles={["ADMIN"]}>
                                                {member._id !== currentUser?.id && (
                                                    <button
                                                        onClick={() => handleOpenDelete(member)}
                                                        className="p-2 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                                        title="Remove member"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                )}
                                            </RoleGate>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredMembers.length === 0 && (
                            <div className="py-12 text-center text-zinc-400 text-sm">
                                {searchQuery ? `No members found matching "${searchQuery}"` : "No team members yet."}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {showInviteModal && createPortal(
                <div
                    className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-zinc-900/50 backdrop-blur-sm ${isClosing ? 'animate-out fade-out duration-300' : 'animate-in fade-in duration-300'}`}
                    onMouseDown={(e) => { if (e.target === e.currentTarget) handleCloseInvite(); }}
                >
                    <div className={`relative bg-white dark:bg-zinc-900/40 dark:backdrop-blur-xl border border-zinc-200/60 dark:border-zinc-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden origin-top-right fill-mode-forwards ${isClosing ? 'animate-out fade-out zoom-out-50 slide-out-to-top-24 slide-out-to-right-24 duration-300 ease-in' : 'animate-in fade-in zoom-in-50 slide-in-from-top-24 slide-in-from-right-24 duration-300 ease-out'}`}>
                        <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-800/20">
                            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Invite Team Member</h2>
                            <button onClick={handleCloseInvite} className="p-2 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleInvite} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">Full Name</label>
                                <input
                                    type="text"
                                    placeholder="John Doe"
                                    value={form.name}
                                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                    className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/60 dark:border-zinc-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-zinc-900 dark:text-white transition-all"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">Email Address</label>
                                <input
                                    type="email"
                                    placeholder="john@company.com"
                                    value={form.email}
                                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                                    className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/60 dark:border-zinc-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-zinc-900 dark:text-white transition-all"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">Temporary Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Min. 8 characters"
                                        value={form.password}
                                        onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                                        className="w-full px-4 py-2.5 pr-10 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/60 dark:border-zinc-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-zinc-900 dark:text-white transition-all"
                                        required
                                    />
                                    <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600">
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">Role</label>
                                <select
                                    value={form.role}
                                    onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                                    className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/60 dark:border-zinc-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-zinc-900 dark:text-white transition-all"
                                >
                                    <option value="VIEWER">Viewer — Read-only access</option>
                                    <option value="ANALYST">Analyst — Can add & edit feedback</option>
                                    <option value="ADMIN">Admin — Full access</option>
                                </select>
                            </div>

                            <div className="pt-2 flex items-center justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={handleCloseInvite}
                                    className="px-5 py-2.5 text-sm font-bold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 rounded-xl transition-colors shadow-[0_2px_20px_rgb(0,0,0,0.04)] dark:shadow-none shadow-emerald-500/20"
                                >
                                    {isSubmitting ? <><Loader2 size={16} className="animate-spin" /> Inviting...</> : "Send Invite"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>,
                document.body
            )}

            {/* Custom Shadcn-style Delete Confirmation Modal */}
            {deleteModal.isOpen && createPortal(
                <div
                    className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-zinc-900/50 backdrop-blur-sm ${deleteModal.isClosing ? 'animate-out fade-out duration-300' : 'animate-in fade-in duration-300'}`}
                    onMouseDown={(e) => { if (e.target === e.currentTarget) handleCloseDelete(); }}
                >
                    <div className={`relative bg-white dark:bg-zinc-900/40 dark:backdrop-blur-xl border border-zinc-200/60 dark:border-zinc-800 rounded-2xl shadow-2xl w-full max-w-sm p-6 overflow-hidden ${deleteModal.isClosing ? 'animate-out fade-out zoom-out-95 duration-200' : 'animate-in fade-in zoom-in-95 duration-200'}`}>
                        <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">Remove Member</h2>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6 leading-relaxed">
                            Are you sure you want to remove <span className="font-semibold text-zinc-700 dark:text-zinc-300">{deleteModal.member?.name}</span> from the workspace? This action cannot be undone.
                        </p>
                        <div className="flex gap-3 justify-end mt-2">
                            <button
                                onClick={handleCloseDelete}
                                disabled={isRemoving}
                                className="px-4 py-2 text-sm font-semibold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmRemove}
                                disabled={isRemoving}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-50 rounded-xl transition-colors shadow-[0_2px_20px_rgb(0,0,0,0.04)] dark:shadow-none shadow-rose-500/20"
                            >
                                {isRemoving ? <><Loader2 size={16} className="animate-spin" /> Removing...</> : "Remove Member"}
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};
