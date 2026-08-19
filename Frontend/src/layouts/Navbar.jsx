import { Search, Sparkles } from "lucide-react";
import { useAuthStore } from "../features/auth/store/authStore";
import { ThemeToggle } from "../components/ThemeToggle";
import { useLayoutStore } from "../store/layoutStore";

export const Navbar = () => {
  const { user } = useAuthStore();
  const { isAskLoopOpen, toggleAskLoop } = useLayoutStore();

  return (
    <>
      <header className="h-16 bg-white/80 backdrop-blur-md dark:bg-zinc-950/50 dark:backdrop-blur-2xl border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between px-8 shrink-0 transition-colors duration-300 z-10 relative">
        <div className="flex items-center gap-2 text-gray-400">
          <div className="w-64 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-full px-4 py-2 flex items-center gap-2 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all">
            <Search size={16} className="text-gray-400 dark:text-zinc-500" />
            <input 
              type="text" 
              placeholder="Search here..." 
              className="bg-transparent border-none outline-none text-sm w-full text-gray-700 dark:text-zinc-300 placeholder-gray-400 dark:placeholder-zinc-500" 
            />
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleAskLoop}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors text-sm font-bold border ${isAskLoopOpen ? 'bg-emerald-600 text-white border-emerald-600 shadow-inner' : 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 border-emerald-100 dark:border-emerald-500/20'}`}
          >
            <Sparkles size={16} /> Ask LOOP
          </button>
          
          <ThemeToggle />
          
          <div className="flex items-center gap-3 border-l border-gray-200 dark:border-zinc-800 pl-4 ml-2">
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-900 dark:text-zinc-200">{user?.name || "Admin User"}</p>
              <p className="text-xs text-gray-500 dark:text-zinc-500">{user?.email || "admin@loop.com"}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-700 dark:text-emerald-400 font-bold">
              {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};
