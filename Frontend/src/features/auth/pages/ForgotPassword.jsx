import {useState} from "react";
import {Sparkles, ArrowRight, Mail, ArrowLeft} from "lucide-react";
import {useAuth} from "../hooks/useAuth";
import {Link} from "react-router";

export const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const {forgotPassword} = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await forgotPassword(email);
            setIsSubmitted(true);
        } catch (error) {
            alert(error.response?.data?.message || "Failed to send reset link. Please try again.");
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

            {/* Left Side - Branding */}
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
                        Lost your key?<br />We've got you.
                    </h1>
                    <p className="text-zinc-300 text-lg max-w-md drop-shadow-md">
                        Don't worry, happens to the best of us. We'll send you a secure link to reset your password and get you back into LOOP.
                    </p>
                </div>

                <div className="text-zinc-400 text-sm">© 2026 Project LOOP Inc. All rights reserved.</div>
            </div>

            {/* Right Side - Glassmorphic Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative z-10">
                <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-500 ease-out">
                    <div className="bg-white/95 dark:bg-[#0a0514]/90 backdrop-blur-xl p-8 sm:p-10 rounded-3xl shadow-2xl border border-white/20 dark:border-zinc-800/50">
                        {/* Mobile Logo */}
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

                        {!isSubmitted ? (
                            <>
                                <div className="mb-8 text-center lg:text-left">
                                    <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
                                        Reset Password
                                    </h2>
                                    <p className="text-zinc-500 dark:text-zinc-400 text-sm">
                                        Enter your email address and we'll send you a link to reset your password.
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

                                    <button
                                        type="submit"
                                        className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg hover:shadow-emerald-600/25 mt-6"
                                    >
                                        Send Reset Link <ArrowRight size={16} />
                                    </button>
                                </form>
                            </>
                        ) : (
                            <div className="text-center py-6">
                                <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Mail size={32} />
                                </div>
                                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
                                    Check your email
                                </h2>
                                <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-8">
                                    We've sent a password reset link to <span className="font-semibold text-zinc-700 dark:text-zinc-300">{email}</span>.
                                </p>
                            </div>
                        )}

                        <div className="mt-8 text-center">
                            <Link
                                to="/login"
                                className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
                            >
                                <ArrowLeft size={16} /> Back to log in
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
