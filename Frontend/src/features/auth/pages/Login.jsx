import {useState} from "react";
import {Sparkles, ArrowRight, Mail, Lock} from "lucide-react";
import {useAuth} from "../hooks/useAuth";
import {useNavigate, Link} from "react-router";
import { toast } from "sonner";

export const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const {login} = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            toast.success("Login successful!");
            navigate("/dashboard");
        } catch (error) {
            toast.error(error.response?.data?.message || "Login failed. Please check your credentials.");
        }
    };

    return (
        <div className="min-h-screen flex relative">
            {/* FULL SCREEN BACKGROUND IMAGE */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop"
                    alt="Abstract 3D Art"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-emerald-900/30 mix-blend-multiply"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-[#030712]/95 via-[#030712]/80 to-[#030712]/40"></div>
            </div>

            <div className="hidden lg:flex lg:w-1/2 p-12 flex-col justify-between relative z-10">
                <div className="flex items-center gap-2 font-bold text-2xl text-white tracking-tight">
                    <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-md border border-white/20 shadow-lg">
                            <Sparkles size={20} className="text-white" />
                        </div>
                        Project LOOP
                    </Link>
                </div>

                <div className="my-auto">
                    <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-white via-teal-100 to-pink-500 mb-6 leading-tight drop-shadow-xl pb-2">
                        Welcome back to<br />the loop.
                    </h1>
                    <p className="text-zinc-300 text-lg max-w-md drop-shadow-md">
                        Log in to continue building better products with AI-driven feedback analysis.
                    </p>
                </div>

                <div className="text-zinc-400 text-sm">© 2026 Project LOOP Inc. All rights reserved.</div>
            </div>

            {/* Right Side - Glassmorphic Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative z-10">
                <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-500 ease-out">
                    <div className="bg-white/95 dark:bg-[#0a0514]/90 backdrop-blur-xl p-8 sm:p-10 rounded-3xl shadow-2xl border border-white/20 dark:border-zinc-800/50">
                        <div className="flex justify-center mb-8 lg:hidden">
                            <Link
                                to="/"
                                className="flex items-center gap-2 font-bold text-2xl text-zinc-900 dark:text-white tracking-tight"
                            >
                                <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-600/20">
                                    <Sparkles size={20} className="text-white" />
                                </div>
                                Project LOOP
                            </Link>
                        </div>

                        <div className="mb-8 text-center lg:text-left">
                            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
                                Welcome back
                            </h2>
                            <p className="text-zinc-500 dark:text-zinc-400 text-sm">
                                Sign in to your account to continue.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2 text-left">
                                <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail
                                        size={18}
                                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
                                    />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@company.com"
                                        className="w-full pl-11 pr-4 py-3 bg-zinc-50 dark:bg-[#030712]/50 border border-zinc-200/60 dark:border-zinc-800 rounded-xl text-sm focus:bg-white dark:focus:bg-[#030712] focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none text-zinc-900 dark:text-white transition-all shadow-[0_2px_20px_rgb(0,0,0,0.04)] dark:shadow-none"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2 text-left">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                                        Password
                                    </label>
                                    <Link
                                        to="/forgot-password"
                                        className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 transition-colors"
                                    >
                                        Forgot password?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <Lock
                                        size={18}
                                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
                                    />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full pl-11 pr-4 py-3 bg-zinc-50 dark:bg-[#030712]/50 border border-zinc-200/60 dark:border-zinc-800 rounded-xl text-sm focus:bg-white dark:focus:bg-[#030712] focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none text-zinc-900 dark:text-white transition-all shadow-[0_2px_20px_rgb(0,0,0,0.04)] dark:shadow-none"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg hover:shadow-emerald-600/25 mt-6"
                            >
                                Sign In <ArrowRight size={16} />
                            </button>

                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-zinc-200/60 dark:border-zinc-800"></div>
                                </div>
                                <div className="relative flex justify-center text-xs uppercase tracking-wider font-bold">
                                    <span className="px-3 bg-white dark:bg-[#0a0514] text-zinc-400 rounded-full">
                                        Or continue with
                                    </span>
                                </div>
                            </div>

                            <button
                                type="button"
                                className="w-full flex items-center justify-center gap-3 bg-white dark:bg-[#030712]/50 border border-zinc-200/60 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-[#030712] text-zinc-700 dark:text-zinc-300 font-semibold py-3 rounded-xl transition-all shadow-[0_2px_20px_rgb(0,0,0,0.04)] dark:shadow-none"
                            >
                                <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
                                    <path
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        fill="#4285F4"
                                    />
                                    <path
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        fill="#34A853"
                                    />
                                    <path
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                        fill="#FBBC05"
                                    />
                                    <path
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        fill="#EA4335"
                                    />
                                    <path d="M1 1h22v22H1z" fill="none" />
                                </svg>
                                Google
                            </button>
                        </form>

                        <p className="text-center text-sm text-zinc-500 mt-8">
                            Don't have an account?{" "}
                            <Link
                                to="/register"
                                className="font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 hover:underline transition-colors"
                            >
                                Sign up for free
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
