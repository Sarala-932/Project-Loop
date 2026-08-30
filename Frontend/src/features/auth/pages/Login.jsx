import {useState, useEffect} from "react";
import {Sparkles, ArrowRight, Mail, Lock} from "lucide-react";
import {useAuth} from "../hooks/useAuth";
import {useNavigate, Link} from "react-router";
import { toast } from "sonner";

export const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const {login} = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        setEmail("");
        setPassword("");
    }, []);

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

                        <div className="mb-6 text-center lg:text-left">
                            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
                                Welcome back
                            </h2>
                            <p className="text-zinc-500 dark:text-zinc-400 text-sm">
                                Sign in to your account to continue.
                            </p>
                        </div>

                        {/* Demo Credentials Box */}
                        <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-between text-left">
                            <div className="text-xs">
                                <div className="font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5 mb-1.5">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                    Demo Credentials
                                </div>
                                <div className="text-zinc-600 dark:text-zinc-400 space-y-0.5">
                                    <div><span className="font-medium text-zinc-700 dark:text-zinc-300">Email:</span> admin@demo.com</div>
                                    <div><span className="font-medium text-zinc-700 dark:text-zinc-300">Password:</span> 12345678</div>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    setEmail("admin@demo.com");
                                    setPassword("12345678");
                                    toast.info("Demo credentials filled!");
                                }}
                                className="text-xs font-semibold px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors shadow-sm"
                            >
                                Auto-fill
                            </button>
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
