import { useState } from "react";
import { useAuth } from "../../auth/hooks/useAuth";
import { Code, Copy, CheckCircle2 } from "lucide-react";

export const Integration = () => {
    const { user } = useAuth();
    const [copied, setCopied] = useState(false);

    // The script snippet the client will copy
    // Dynamically uses the current domain (localhost for dev, real domain for production)
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173';
    const scriptSnippet = `<script 
  src="${baseUrl}/widget.js" 
  data-workspace-id="${user?.workspaceId}">
</script>`;

    const handleCopy = () => {
        navigator.clipboard.writeText(scriptSnippet);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="p-8 max-w-4xl mx-auto w-full">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-zinc-900 dark:text-white flex items-center gap-3">
                    <Code className="text-emerald-500" size={32} />
                    Widget Integration
                </h1>
                <p className="text-zinc-500 mt-2">
                    Embed the LOOP feedback widget into your website to start collecting real-time feedback.
                </p>
            </div>

            <div className="bg-white dark:bg-zinc-900/40 dark:backdrop-blur-xl border border-zinc-200/60 dark:border-zinc-800 rounded-2xl p-8 shadow-[0_2px_20px_rgb(0,0,0,0.04)] dark:shadow-none">
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">Install Code</h2>
                <p className="text-zinc-500 mb-6 text-sm">
                    Copy the snippet below and paste it just before the closing <code>&lt;/body&gt;</code> tag of your website. The widget will automatically appear in the bottom right corner.
                </p>

                <div className="relative group">
                    <div className="absolute top-4 right-4 flex items-center gap-2">
                        {copied && <span className="text-emerald-500 text-sm font-semibold flex items-center gap-1"><CheckCircle2 size={16}/> Copied!</span>}
                        <button 
                            onClick={handleCopy}
                            className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-colors shadow-md"
                            title="Copy code"
                        >
                            <Copy size={18} />
                        </button>
                    </div>
                    <pre className="bg-zinc-950 text-zinc-300 p-6 rounded-xl overflow-x-auto text-sm font-mono leading-relaxed border border-zinc-800">
                        <code>{scriptSnippet}</code>
                    </pre>
                </div>

                <div className="mt-8 p-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-xl">
                    <h3 className="font-bold text-emerald-900 dark:text-emerald-300 mb-1">Your Workspace ID</h3>
                    <p className="text-emerald-700 dark:text-emerald-400 font-mono text-sm">{user?.workspaceId}</p>
                </div>
            </div>
        </div>
    );
};
