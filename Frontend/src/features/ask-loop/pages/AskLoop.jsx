import {Sparkles, Send, Bot, User, CornerDownLeft} from "lucide-react";
import { useAskLoop } from "../hooks/useAskLoop";

const SUGGESTED_QUESTIONS = [
    "Summarize the most requested features this week.",
    "What are users saying about the new pricing?",
    "List the top 3 critical bugs on iOS.",
];

export const AskLoop = () => {
    const { messages, input, setInput, isTyping, handleSend, handleSuggest } = useAskLoop();

    return (
        <div className="h-[calc(100vh-8rem)] animate-in fade-in zoom-in-95 duration-500 ease-out flex flex-col">
            {/* Header */}
            <div className="mb-6 flex-shrink-0">
                <h1 className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight flex items-center gap-3">
                    Ask LOOP <Sparkles className="text-teal-500" size={28} />
                </h1>
                <p className="text-zinc-500 dark:text-zinc-400 mt-1">
                    Chat directly with your product data using AI.
                </p>
            </div>

            {/* Chat Container */}
            <div className="flex-1 bg-white dark:bg-zinc-900/40 dark:backdrop-blur-xl border border-zinc-200/60 dark:border-zinc-800 rounded-2xl shadow-[0_2px_20px_rgb(0,0,0,0.04)] dark:shadow-none flex flex-col overflow-hidden relative">
                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                        >
                            {/* Avatar */}
                            <div className="flex-shrink-0 mt-1">
                                {msg.role === "ai" ? (
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center shadow-md">
                                        <Bot size={20} className="text-white" />
                                    </div>
                                ) : (
                                    <div className="w-10 h-10 rounded-xl bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center border border-zinc-300 dark:border-zinc-700">
                                        <User size={20} className="text-zinc-600 dark:text-zinc-400" />
                                    </div>
                                )}
                            </div>

                            {/* Message Bubble */}
                            <div
                                className={`max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed ${
                                    msg.role === "user"
                                        ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-tr-sm"
                                        : "bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-500/20 text-zinc-800 dark:text-zinc-200 rounded-tl-sm"
                                }`}
                            >
                                {msg.content}
                            </div>
                        </div>
                    ))}

                    {/* Typing Indicator */}
                    {isTyping && (
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 mt-1">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center shadow-md">
                                    <Bot size={20} className="text-white animate-pulse" />
                                </div>
                            </div>
                            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-500/20 rounded-2xl rounded-tl-sm p-4 flex items-center gap-1.5">
                                <div
                                    className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce"
                                    style={{animationDelay: "0ms"}}
                                ></div>
                                <div
                                    className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce"
                                    style={{animationDelay: "150ms"}}
                                ></div>
                                <div
                                    className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce"
                                    style={{animationDelay: "300ms"}}
                                ></div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="p-4 bg-zinc-50 dark:bg-[#030712] border-t border-zinc-200/60 dark:border-zinc-800">
                    {/* Suggestions */}
                    {messages.length === 1 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                            {SUGGESTED_QUESTIONS.map((q, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleSuggest(q)}
                                    className="px-3 py-1.5 text-xs font-medium bg-white dark:bg-zinc-900/40 dark:backdrop-blur-xl border border-zinc-200/60 dark:border-zinc-700 rounded-full text-zinc-600 dark:text-zinc-300 hover:border-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                                >
                                    {q}
                                </button>
                            ))}
                        </div>
                    )}

                    <form onSubmit={handleSend} className="relative flex items-center">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask anything about your product feedback..."
                            className="w-full pl-4 pr-24 py-3.5 bg-white dark:bg-zinc-900/40 dark:backdrop-blur-xl border border-zinc-300 dark:border-zinc-700 rounded-2xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none text-zinc-900 dark:text-white transition-all shadow-[0_2px_20px_rgb(0,0,0,0.04)] dark:shadow-none"
                        />
                        <div className="absolute right-2 flex items-center gap-2">
                            <button
                                type="submit"
                                disabled={!input.trim()}
                                className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center hover:bg-emerald-700 disabled:opacity-50 disabled:hover:bg-emerald-600 transition-colors shadow-[0_2px_20px_rgb(0,0,0,0.04)] dark:shadow-none"
                            >
                                <Send size={18} className="ml-0.5" />
                            </button>
                        </div>
                    </form>
                    <div className="mt-2 text-center text-[11px] font-medium text-zinc-400 dark:text-zinc-500 flex items-center justify-center gap-1">
                        Press{" "}
                        <kbd className="px-1.5 py-0.5 bg-zinc-200 dark:bg-zinc-800 rounded text-[10px] border border-zinc-300 dark:border-zinc-700 font-sans shadow-[0_2px_20px_rgb(0,0,0,0.04)] dark:shadow-none">
                            <CornerDownLeft size={10} />
                        </kbd>{" "}
                        to send
                    </div>
                </div>
            </div>
        </div>
    );
};
