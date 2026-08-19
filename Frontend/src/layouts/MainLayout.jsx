import { Outlet, useLocation } from "react-router";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";
import { AskLoopDrawer } from "../components/AskLoopDrawer";
import { useLayoutStore } from "../store/layoutStore";

export const MainLayout = () => {
  const location = useLocation();
  const { isAskLoopOpen, setAskLoopOpen } = useLayoutStore();

  return (
    <div className="flex h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300 overflow-hidden font-sans relative"><div className="hidden dark:block absolute top-[-15%] left-[-10%] w-[50%] h-[50%] bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="hidden dark:block absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-teal-600/10 rounded-full blur-[120px] pointer-events-none z-0"></div>

      {/* Sidebar - removed wrapper to fix height and z-index issues */}
      <Sidebar />

      <main className="flex-1 flex flex-col h-screen overflow-hidden z-10 relative bg-transparent border-l border-zinc-200/60 dark:border-zinc-800/30 shadow-[-4px_0_24px_-12px_rgba(0,0,0,0.1)] dark:shadow-none">
        <Navbar />

        <div className="flex-1 overflow-auto p-8 text-zinc-900 dark:text-zinc-100 relative">
          <div key={location.pathname} className="animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out fill-mode-both relative z-10">
            <Outlet />
          </div>
        </div>
      </main>

      {/* Side panel for Ask LOOP */}
      <div className="z-50">
        <AskLoopDrawer isOpen={isAskLoopOpen} onClose={() => setAskLoopOpen(false)} />
      </div>
    </div>
  );
};
