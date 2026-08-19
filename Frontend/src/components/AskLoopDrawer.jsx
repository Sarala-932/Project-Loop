import {useState, useEffect, useRef} from "react";
import {createPortal} from "react-dom";
import {Sparkles, Send, Bot, User, X} from "lucide-react";
import {useAskLoop} from "../features/ask-loop/hooks/useAskLoop";

const SUGGESTED_QUESTIONS = [
    "Summarize requested features.",
    "What are users saying about pricing?",
    "List top 3 critical bugs.",
];

export const AskLoopDrawer = ({isOpen, onClose}) => {
    const {messages, input, setInput, isTyping, handleSend, handleSuggest} = useAskLoop();
    const scrollContainerRef = useRef(null);

    const scrollToBottom = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTo({
                top: scrollContainerRef.current.scrollHeight,
                behavior: "smooth"
            });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    return (
        <div 
            className={`transition-all duration-300 ease-in-out shrink-0 h-full overflow-hidden ${!isOpen ? 'w-0 opacity-0' : 'w-[400px] opacity-100'}`}
        >
            <div className="w-[400px] bg-white dark:bg-zinc-950 h-full flex flex-col border-l border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-xl shrink-0">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center shadow-sm">
                            <Sparkles size={16} className="text-white" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                                AI Product Assistant
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 flex flex-col overflow-hidden bg-zinc-50/30 dark:bg-zinc-950/50">
                    <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-6 space-y-6">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                            >
                                {/* Avatar */}
                                <div className="flex-shrink-0 mt-1">
                                    {msg.role === "ai" ? (
                                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center shadow-sm">
                                            <Bot size={16} className="text-white" />
                                        </div>
                                    ) : (
                                        <div className="w-8 h-8 rounded-lg bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center border border-zinc-300 dark:border-zinc-700">
                                            <User size={16} className="text-zinc-600 dark:text-zinc-400" />
                                        </div>
                                    )}
                                </div>

                                <div
                                    className={`max-w-[90%] rounded-2xl p-3.5 text-sm leading-relaxed shadow-sm overflow-x-auto ${
                                        msg.role === "user"
                                            ? "bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-tr-sm"
                                            : "bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-500/20 text-zinc-800 dark:text-zinc-200 rounded-tl-sm"
                                    }`}
                                >
                                    <div className="whitespace-pre-wrap break-words space-y-1">
                                        {msg.content.split("\n").map((line, i) => {
                                            if (!line.trim()) return <div key={i} className="h-2"></div>;

                                            // Headers
                                            if (line.startsWith("### "))
                                                return (
                                                    <div
                                                        key={i}
                                                        className="font-bold text-base mt-3 mb-1 text-zinc-900 dark:text-white"
                                                    >
                                                        {line.replace("### ", "")}
                                                    </div>
                                                );
                                            if (line.startsWith("## "))
                                                return (
                                                    <div
                                                        key={i}
                                                        className="font-bold text-lg mt-4 mb-2 text-emerald-700 dark:text-emerald-400"
                                                    >
                                                        {line.replace("## ", "")}
                                                    </div>
                                                );
                                            if (line.startsWith("# "))
                                                return (
                                                    <div
                                                        key={i}
                                                        className="font-bold text-xl mt-4 mb-2 text-emerald-700 dark:text-emerald-400"
                                                    >
                                                        {line.replace("# ", "")}
                                                    </div>
                                                );

                                            const parts = line.split(/\*\*(.*?)\*\*/g);
                                            return (
                                                <div key={i}>
                                                    {parts.map((part, j) =>
                                                        j % 2 === 1 ? (
                                                            <strong
                                                                key={j}
                                                                className="font-semibold text-zinc-900 dark:text-white"
                                                            >
                                                                {part}
                                                            </strong>
                                                        ) : (
                                                            part
                                                        ),
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {isTyping && (
                            <div className="flex gap-3 flex-row">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center shadow-sm shrink-0">
                                    <Sparkles size={16} className="text-white" />
                                </div>
                                <div className="bg-white dark:bg-[#030712] border border-zinc-200 dark:border-zinc-800 rounded-2xl rounded-tl-none px-5 py-3.5 shadow-sm flex items-center gap-1.5 w-20">
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
                        {messages.length === 1 && (
                            <div className="flex flex-wrap gap-2 mt-4">
                                {SUGGESTED_QUESTIONS.map((q, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleSuggest(q)}
                                        className="px-3 py-1.5 text-xs font-medium bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-full text-zinc-600 dark:text-zinc-300 hover:border-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors text-left"
                                    >
                                        {q}
                                    </button>
                                ))}
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="p-4 bg-white dark:bg-[#030712] border-t border-zinc-200 dark:border-zinc-800 shrink-0">
                        <form onSubmit={handleSend} className="relative flex items-center">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask LOOP anything..."
                                className="w-full pl-4 pr-14 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none text-zinc-900 dark:text-white transition-all"
                            />
                            <div className="absolute right-1.5 flex items-center">
                                <button
                                    type="submit"
                                    disabled={!input.trim()}
                                    className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center hover:bg-emerald-700 disabled:opacity-50 disabled:hover:bg-emerald-600 transition-colors shadow-sm"
                                >
                                    <Send size={16} className="ml-0.5" />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

