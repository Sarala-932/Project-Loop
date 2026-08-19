import {
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import {TrendingUp, MessageSquare, ThumbsUp, ThumbsDown, Loader2, Activity} from "lucide-react";
import {useAnalytics} from "../hooks/useAnalytics";

const COLORS = ["#0d9488", "#059669", "#f97316", "#eab308", "#10b981", "#ec4899"];
const SENTIMENT_COLORS = {POS: "#10b981", NEG: "#ef4444", NEU: "#f59e0b"};

const CustomTooltipStyle = {
    backgroundColor: "#0f172a",
    border: "none",
    borderRadius: "12px",
    color: "#f8fafc",
};

export const Analytics = () => {
    const {data, isLoading, error} = useAnalytics();

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="animate-spin text-emerald-500 mb-4" size={40} />
                <p className="text-zinc-500 font-medium">Loading analytics...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 text-red-500 rounded-2xl flex items-center justify-center mb-4">
                    <Activity size={32} />
                </div>
                <p className="text-red-500 dark:text-red-400 font-medium">{error}</p>
            </div>
        );
    }

    const stats = data?.statCards || {};
    const totalFeedbacks = stats.totalFeedbacks || 0;
    const positive = stats.positiveCount || 0;
    const negative = stats.negativeCount || 0;
    const neutral = totalFeedbacks - positive - negative;
    const posPercent = totalFeedbacks > 0 ? ((positive / totalFeedbacks) * 100).toFixed(1) : 0;
    const negPercent = totalFeedbacks > 0 ? ((negative / totalFeedbacks) * 100).toFixed(1) : 0;
    const neuPercent = totalFeedbacks > 0 ? ((neutral / totalFeedbacks) * 100).toFixed(1) : 0;

    const volumeData = (data?.volumeOverTime || []).map((d) => ({
        name: new Date(d.date).toLocaleDateString("en-US", {month: "short", day: "numeric"}),
        Positive: d.POS || 0,
        Negative: d.NEG || 0,
    }));

    const sentimentPieData = [
        {name: "Positive", value: positive},
        {name: "Negative", value: negative},
        {name: "Neutral", value: neutral},
    ].filter((d) => d.value > 0);

    const topThemes = (data?.topThemes || []).slice(0, 6).map((t) => ({
        name: t.name,
        count: t.count,
    }));

    const sourceDataRaw = data?.feedbackBySource || {};
    const sourceData = Object.entries(sourceDataRaw).map(([name, value]) => ({name, value}));
    const totalSource = sourceData.reduce((acc, cur) => acc + cur.value, 0);

    return (
        <div className="space-y-6 pb-10 animate-in fade-in duration-500 max-w-[1400px] mx-auto">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">
                    Analytics
                </h1>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                    Deep dive into your feedback metrics and trends.
                </p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="bg-white dark:bg-zinc-900/40 dark:backdrop-blur-xl p-5 rounded-2xl border border-zinc-200/60 dark:border-zinc-800 shadow-[0_2px_20px_rgb(0,0,0,0.04)] dark:shadow-none">
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-sm font-bold text-teal-600 dark:text-teal-500">Total Feedback</p>
                        <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center">
                            <MessageSquare size={18} className="text-emerald-600 dark:text-emerald-400" />
                        </div>
                    </div>
                    <h3 className="text-3xl font-extrabold text-zinc-900 dark:text-white">
                        {totalFeedbacks}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1">in selected time range</p>
                </div>

                <div className="bg-white dark:bg-zinc-900/40 dark:backdrop-blur-xl p-5 rounded-2xl border border-zinc-200/60 dark:border-zinc-800 shadow-[0_2px_20px_rgb(0,0,0,0.04)] dark:shadow-none">
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-sm font-bold text-emerald-600 dark:text-emerald-500">Positive</p>
                        <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center">
                            <ThumbsUp size={18} className="text-emerald-600 dark:text-emerald-400" />
                        </div>
                    </div>
                    <h3 className="text-3xl font-extrabold text-zinc-900 dark:text-white">{positive}</h3>
                    <div className="mt-2 h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-emerald-500 rounded-full"
                            style={{width: `${posPercent}%`}}
                        ></div>
                    </div>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-semibold">
                        {posPercent}% of total
                    </p>
                </div>

                <div className="bg-white dark:bg-zinc-900/40 dark:backdrop-blur-xl p-5 rounded-2xl border border-zinc-200/60 dark:border-zinc-800 shadow-[0_2px_20px_rgb(0,0,0,0.04)] dark:shadow-none">
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-sm font-bold text-rose-600 dark:text-rose-500">Negative</p>
                        <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center">
                            <ThumbsDown size={18} className="text-rose-600 dark:text-rose-400" />
                        </div>
                    </div>
                    <h3 className="text-3xl font-extrabold text-zinc-900 dark:text-white">{negative}</h3>
                    <div className="mt-2 h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-rose-500 rounded-full"
                            style={{width: `${negPercent}%`}}
                        ></div>
                    </div>
                    <p className="text-xs text-rose-600 dark:text-rose-400 mt-1 font-semibold">
                        {negPercent}% of total
                    </p>
                </div>

                <div className="bg-white dark:bg-zinc-900/40 dark:backdrop-blur-xl p-5 rounded-2xl border border-zinc-200/60 dark:border-zinc-800 shadow-[0_2px_20px_rgb(0,0,0,0.04)] dark:shadow-none">
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-sm font-bold text-amber-500 dark:text-amber-500">Neutral</p>
                        <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center">
                            <TrendingUp size={18} className="text-amber-500 dark:text-amber-400" />
                        </div>
                    </div>
                    <h3 className="text-3xl font-extrabold text-zinc-900 dark:text-white">{neutral}</h3>
                    <div className="mt-2 h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-amber-400 rounded-full"
                            style={{width: `${neuPercent}%`}}
                        ></div>
                    </div>
                    <p className="text-xs text-amber-500 dark:text-amber-400 mt-1 font-semibold">
                        {neuPercent}% of total
                    </p>
                </div>
            </div>

            {/* Row 2: Volume over time (full width) */}
            <div className="bg-white dark:bg-zinc-900/40 dark:backdrop-blur-xl p-6 rounded-2xl border border-zinc-200/60 dark:border-zinc-800 shadow-[0_2px_20px_rgb(0,0,0,0.04)] dark:shadow-none">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                        Feedback Volume Over Time
                    </h3>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                            <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                                Positive
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                            <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                                Negative
                            </span>
                        </div>
                    </div>
                </div>
                <div className="h-64">
                    {volumeData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={volumeData}
                                margin={{top: 5, right: 10, left: -20, bottom: 0}}
                                barGap={4}
                            >
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    vertical={false}
                                    stroke="#e2e8f0"
                                    className="dark:stroke-zinc-800"
                                />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{fill: "#94a3b8", fontSize: 12}}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{fill: "#94a3b8", fontSize: 12}}
                                />
                                <Tooltip
                                    contentStyle={CustomTooltipStyle}
                                    cursor={{fill: "rgba(148,163,184,0.08)"}}
                                />
                                <Bar dataKey="Positive" fill="#10b981" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="Negative" fill="#ef4444" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-full text-zinc-400 text-sm">
                            No volume data for this period
                        </div>
                    )}
                </div>
            </div>

            {/* Row 3: Sentiment Pie + Top Themes side by side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Sentiment Breakdown Donut */}
                <div className="bg-white dark:bg-zinc-900/40 dark:backdrop-blur-xl p-6 rounded-2xl border border-zinc-200/60 dark:border-zinc-800 shadow-[0_2px_20px_rgb(0,0,0,0.04)] dark:shadow-none">
                    <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-6">
                        Sentiment Breakdown
                    </h3>
                    <div className="flex items-center justify-center gap-10">
                        <div className="relative" style={{width: 180, height: 180}}>
                            <PieChart width={180} height={180} style={{overflow: "visible"}}>
                                <Pie
                                    data={sentimentPieData}
                                    cx={90}
                                    cy={90}
                                    innerRadius={55}
                                    outerRadius={82}
                                    paddingAngle={3}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {sentimentPieData.map((entry, index) => {
                                        const colorMap = {
                                            Positive: SENTIMENT_COLORS.POS,
                                            Negative: SENTIMENT_COLORS.NEG,
                                            Neutral: SENTIMENT_COLORS.NEU,
                                        };
                                        return <Cell key={`cell-${index}`} fill={colorMap[entry.name]} />;
                                    })}
                                </Pie>
                                <Tooltip contentStyle={CustomTooltipStyle} />
                            </PieChart>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-xl font-extrabold text-zinc-900 dark:text-white">
                                    {totalFeedbacks}
                                </span>
                                <span className="text-xs font-semibold text-zinc-500">Total</span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-4">
                            {[
                                {
                                    label: "Positive",
                                    value: positive,
                                    pct: posPercent,
                                    color: "bg-emerald-500",
                                },
                                {label: "Negative", value: negative, pct: negPercent, color: "bg-rose-500"},
                                {label: "Neutral", value: neutral, pct: neuPercent, color: "bg-amber-400"},
                            ].map((item) => (
                                <div key={item.label} className="flex items-center gap-3">
                                    <div className={`w-3 h-3 rounded-full shrink-0 ${item.color}`}></div>
                                    <div>
                                        <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                                            {item.label}
                                        </p>
                                        <p className="text-xs text-zinc-400">
                                            {item.value} &nbsp;·&nbsp; {item.pct}%
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Top Themes Horizontal Bar */}
                <div className="bg-white dark:bg-zinc-900/40 dark:backdrop-blur-xl p-6 rounded-2xl border border-zinc-200/60 dark:border-zinc-800 shadow-[0_2px_20px_rgb(0,0,0,0.04)] dark:shadow-none">
                    <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-6">Top Themes</h3>
                    {topThemes.length > 0 ? (
                        <div className="space-y-3">
                            {topThemes.map((theme, index) => {
                                const maxCount = topThemes[0]?.count || 1;
                                const width = ((theme.count / maxCount) * 100).toFixed(0);
                                return (
                                    <div key={index} className="flex items-center gap-3">
                                        <span
                                            className="text-sm font-medium text-zinc-600 dark:text-zinc-400 w-28 shrink-0 truncate"
                                            title={theme.name}
                                        >
                                            {theme.name}
                                        </span>
                                        <div className="flex-1 h-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                            <div
                                                className="h-full rounded-full transition-all duration-700"
                                                style={{
                                                    width: `${width}%`,
                                                    backgroundColor: COLORS[index % COLORS.length],
                                                }}
                                            ></div>
                                        </div>
                                        <span className="text-sm font-bold text-zinc-900 dark:text-white w-6 text-right shrink-0">
                                            {theme.count}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-40 text-zinc-400 text-sm">
                            No theme data available. Run AI analysis on feedbacks first.
                        </div>
                    )}
                </div>
            </div>

            {/* Row 4: Feedback by Source */}
            <div className="bg-white dark:bg-zinc-900/40 dark:backdrop-blur-xl p-6 rounded-2xl border border-zinc-200/60 dark:border-zinc-800 shadow-[0_2px_20px_rgb(0,0,0,0.04)] dark:shadow-none">
                <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-6">
                    Feedback by Source
                </h3>
                {sourceData.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {sourceData.map((item, index) => {
                            const pct = totalSource > 0 ? ((item.value / totalSource) * 100).toFixed(1) : 0;
                            return (
                                <div
                                    key={index}
                                    className="flex items-center gap-4 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800"
                                >
                                    <div
                                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                                        style={{backgroundColor: `${COLORS[index % COLORS.length]}20`}}
                                    >
                                        <div
                                            className="w-4 h-4 rounded-full"
                                            style={{backgroundColor: COLORS[index % COLORS.length]}}
                                        ></div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-zinc-900 dark:text-white truncate">
                                            {item.name}
                                        </p>
                                        <p className="text-xs text-zinc-500">
                                            {item.value} feedback · {pct}%
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-24 text-zinc-400 text-sm">
                        No source data available
                    </div>
                )}
            </div>
        </div>
    );
};
