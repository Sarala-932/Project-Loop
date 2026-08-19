import {NavLink} from "react-router";
import {LayoutDashboard, MessageSquare, BarChart3, LogOut, Users, FileText, Code, ChevronLeft, ChevronRight} from "lucide-react";
import {useAuth} from "../features/auth/hooks/useAuth";
import {RoleGate} from "../components/RoleGate";
import {useLayoutStore} from "../store/layoutStore";

export const Sidebar = () => {
    const {logout} = useAuth();
    const {isSidebarCollapsed, toggleSidebar} = useLayoutStore();

    return (
        <aside className={`h-full w-full max-w-[16rem] ${isSidebarCollapsed ? "w-20 max-w-[5rem]" : "w-64"} bg-white dark:bg-zinc-950/50 dark:backdrop-blur-2xl text-zinc-500 dark:text-zinc-400 flex flex-col border-r border-zinc-200/60 dark:border-zinc-800 shrink-0 transition-all duration-300 ease-in-out relative z-50`}>
            {/* Toggle Button */}
            <button 
                onClick={toggleSidebar}
                className="absolute -right-3 top-6 w-6 h-6 bg-white dark:bg-zinc-800 text-zinc-500 dark:text-zinc-300 rounded-full flex items-center justify-center border border-zinc-200/60 dark:border-zinc-700 hover:text-emerald-600 dark:hover:text-white hover:border-emerald-600 transition-colors shadow-sm z-[60]"
            >
                {isSidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>

            <div className={`p-6 flex items-center gap-3 text-zinc-900 dark:text-white font-bold text-xl tracking-wide ${isSidebarCollapsed ? "justify-center px-0" : ""}`}>
                <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-600/20 shrink-0">
                    <LayoutDashboard size={18} className="text-white" />
                </div>
                {!isSidebarCollapsed && <span className="whitespace-nowrap transition-opacity duration-300">AI Feedback</span>}
            </div>

            <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto">
                <NavLink
                    to="/dashboard"
                    end
                    className={({isActive}) =>
                        `flex items-center gap-3 py-3 rounded-xl transition-colors ${isSidebarCollapsed ? "justify-center px-0" : "px-4"} ${isActive ? "bg-emerald-600 text-white shadow-md shadow-emerald-900/20" : "hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-white"}`
                    }
                    title="Dashboard"
                >
                    <LayoutDashboard size={20} className="shrink-0" />
                    {!isSidebarCollapsed && <span className="whitespace-nowrap">Dashboard</span>}
                </NavLink>
                <NavLink
                    to="/dashboard/feedbacks"
                    className={({isActive}) =>
                        `flex items-center gap-3 py-3 rounded-xl transition-colors ${isSidebarCollapsed ? "justify-center px-0" : "px-4"} ${isActive ? "bg-emerald-600 text-white shadow-md shadow-emerald-900/20" : "hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-white"}`
                    }
                    title="Feedback"
                >
                    <MessageSquare size={20} className="shrink-0" />
                    {!isSidebarCollapsed && <span className="whitespace-nowrap">Feedback</span>}
                </NavLink>

                <NavLink
                    to="/dashboard/analytics"
                    className={({isActive}) =>
                        `flex items-center gap-3 py-3 rounded-xl transition-colors ${isSidebarCollapsed ? "justify-center px-0" : "px-4"} ${isActive ? "bg-emerald-600 text-white shadow-md shadow-emerald-900/20" : "hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-white"}`
                    }
                    title="Analytics"
                >
                    <BarChart3 size={20} className="shrink-0" />
                    {!isSidebarCollapsed && <span className="whitespace-nowrap">Analytics</span>}
                </NavLink>
                
                <NavLink
                    to="/dashboard/reports"
                    className={({isActive}) =>
                        `flex items-center gap-3 py-3 rounded-xl transition-colors ${isSidebarCollapsed ? "justify-center px-0" : "px-4"} ${isActive ? "bg-emerald-600 text-white shadow-md shadow-emerald-900/20" : "hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-white"}`
                    }
                    title="AI Reports"
                >
                    <FileText size={20} className="shrink-0" />
                    {!isSidebarCollapsed && <span className="whitespace-nowrap">AI Reports</span>}
                </NavLink>
                <RoleGate allowedRoles={['ADMIN']}>
                    <NavLink
                        to="/dashboard/integration"
                        className={({isActive}) =>
                            `flex items-center gap-3 py-3 rounded-xl transition-colors ${isSidebarCollapsed ? "justify-center px-0" : "px-4"} ${isActive ? "bg-emerald-600 text-white shadow-md shadow-emerald-900/20" : "hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-white"}`
                        }
                        title="Widget Integration"
                    >
                        <Code size={20} className="shrink-0" />
                        {!isSidebarCollapsed && <span className="whitespace-nowrap">Widget Integration</span>}
                    </NavLink>
                    <NavLink
                        to="/dashboard/team"
                        className={({isActive}) =>
                            `flex items-center gap-3 py-3 rounded-xl transition-colors ${isSidebarCollapsed ? "justify-center px-0" : "px-4"} ${isActive ? "bg-emerald-600 text-white shadow-md shadow-emerald-900/20" : "hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-white"}`
                        }
                        title="Team Settings"
                    >
                        <Users size={20} className="shrink-0" />
                        {!isSidebarCollapsed && <span className="whitespace-nowrap">Team Settings</span>}
                    </NavLink>
                </RoleGate>
            </nav>

            <div className={`p-4 border-t border-zinc-200/60 dark:border-zinc-800/50 mt-auto ${isSidebarCollapsed ? "flex justify-center" : ""}`}>
                <button
                    onClick={logout}
                    className={`flex items-center gap-3 py-3 rounded-xl transition-colors text-rose-500 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10 dark:hover:text-rose-300 ${isSidebarCollapsed ? "justify-center px-0 w-full" : "px-4 w-full text-left"}`}
                    title="Logout"
                >
                    <LogOut size={20} className="shrink-0" />
                    {!isSidebarCollapsed && <span className="whitespace-nowrap">Logout</span>}
                </button>
            </div>
        </aside>
    );
};
