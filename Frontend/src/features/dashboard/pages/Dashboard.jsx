import {useState, useMemo} from "react";
import {
    Users,
    Star,
    TrendingUp,
    Clock,
    Loader2,
    Calendar as CalendarIcon,
    ChevronDown,
    CheckCircle2,
    ShieldAlert,
    ArrowRight,
} from "lucide-react";
import {
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import {useAnalytics} from "../../analytics/hooks/useAnalytics";
import {useFeedbacks} from "../../feedbacks/hooks/useFeedbacks";
import {useAuth} from "../../auth/hooks/useAuth";
import {Link} from "react-router";

const COLORS = ["#0d9488", "#059669", "#f97316", "#eab308", "#14b8a6"];

export const DashboardPage = () => {
    const {data: analyticsData, isLoading: analyticsLoading, days, setDays} = useAnalytics();
    const {feedbacks, isLoading: feedbacksLoading} = useFeedbacks();
    const {user} = useAuth();
    const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);

    if (analyticsLoading || feedbacksLoading) {
        return (
            <div className="h-full flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
            </div>
        );
    }

    // 1. Dynamic Top Date Range based on selected days
    const today = new Date();
    const pastDate = new Date(today.getTime() - days * 24 * 60 * 60 * 1000);
    const dateRangeStr = `${pastDate.toLocaleDateString("en-US", {month: "short", day: "numeric"})} - ${today.toLocaleDateString("en-US", {month: "short", day: "numeric", year: "numeric"})}`;

    const dateOptions = [
        {label: "Last 7 Days", value: 7},
        {label: "Last 30 Days", value: 30},
        {label: "Last 3 Months", value: 90},
        {label: "Last 6 Months", value: 180},
        {label: "Last 1 Year", value: 365},
    ];
    const selectedLabel = dateOptions.find((opt) => opt.value === days)?.label || "Last 30 Days";

    const stats = analyticsData?.statCards || {};
    const totalFeedbacks = stats.totalFeedbacks || 0;
    const positive = stats.positiveCount || 0;
    const negative = stats.negativeCount || 0;

    const neutral = stats.neutralCount ?? totalFeedbacks - positive - negative;

    const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    // const oneMonthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000);

    let currTotal = 0,
        prevTotal = 0;
    let currPos = 0,
        prevPos = 0;
    let currNeg = 0,
        prevNeg = 0;
    let currPend = 0,
        prevPend = 0;

    (feedbacks || []).forEach((fb) => {
        const date = new Date(fb.createdAt || fb.date);
        if (date >= oneWeekAgo) {
            currTotal++;
            if (fb.sentiment === "POS") currPos++;
            else if (fb.sentiment === "NEG") currNeg++;
            else currPend++;
        } else if (date >= twoWeeksAgo && date < oneWeekAgo) {
            prevTotal++;
            if (fb.sentiment === "POS") prevPos++;
            else if (fb.sentiment === "NEG") prevNeg++;
            else prevPend++;
        }
    });

    const calcTrend = (curr, prev) => {
        if (prev === 0) return curr > 0 ? "+100%" : "0%";
        const diff = ((curr - prev) / prev) * 100;
        return `${diff > 0 ? "+" : ""}${diff.toFixed(1)}%`;
    };

    const trends = {
        total: calcTrend(currTotal, prevTotal),
        pos: calcTrend(currPos, prevPos),
        neg: calcTrend(currNeg, prevNeg),
        pend: calcTrend(currPend, prevPend),
    };

    const rawChartData = analyticsData?.volumeOverTime || [];
    let chartData = rawChartData.map((d) => ({
        name: new Date(d.date).toLocaleDateString("en-US", {month: "short", day: "numeric"}),
        Positive: d.POS || 0,
        Negative: d.NEG || 0,
    }));
    if (chartData.length === 0) {
        chartData = [
            {
                name: today.toLocaleDateString("en-US", {month: "short", day: "numeric"}),
                Positive: 0,
                Negative: 0,
            },
        ];
    }

    const sourceDataRaw = analyticsData?.feedbackBySource || {};
    let sourceData = Object.entries(sourceDataRaw).map(([name, value]) => ({name, value}));
    if (sourceData.length === 0) {
        sourceData = [{name: "No Data Yet", value: 1}];
    }

    const totalSourceValue = sourceData.reduce(
        (acc, curr) => acc + (curr.name === "No Data Yet" ? 0 : curr.value),
        0,
    );

    // 6. Recent Feedbacks (Dynamic)
    const recentFeedbacks = feedbacks?.slice(0, 5) || [];

    return (
        <div className="space-y-6 pb-10 animate-in fade-in duration-500 max-w-[1400px] mx-auto font-sans">
            {/* Top Header Row */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-20">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">
                        Dashboard
                    </h1>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                        Welcome back, {user?.name?.split(" ")[0] || "Admin"}! Here's what's happening today.
                    </p>
                </div>

                <div className="relative">
                    <button
                        onClick={() => setIsDateDropdownOpen(!isDateDropdownOpen)}
                        className="flex items-center gap-2 bg-white dark:bg-zinc-900/40 dark:backdrop-blur-xl border border-zinc-200/60 dark:border-zinc-700 px-4 py-2.5 rounded-xl text-sm font-semibold text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 shadow-[0_2px_20px_rgb(0,0,0,0.04)] dark:shadow-none transition-colors"
                    >
                        <CalendarIcon size={16} className="text-zinc-500 dark:text-zinc-400" />
                        <span className="hidden sm:inline">{selectedLabel}</span>
                        <span className="sm:hidden">{dateRangeStr}</span>
                        <ChevronDown size={16} className="text-zinc-400 ml-1" />
                    </button>

                    {isDateDropdownOpen && (
                        <>
                            <div
                                className="fixed inset-0 z-10"
                                onClick={() => setIsDateDropdownOpen(false)}
                            ></div>
                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 rounded-xl shadow-lg z-20 py-1 overflow-hidden animate-in fade-in slide-in-from-top-2">
                                <div className="px-3 py-2 text-xs font-bold text-zinc-500 uppercase tracking-wider border-b border-zinc-100 dark:border-zinc-800 mb-1">
                                    Time Range
                                </div>
                                {dateOptions.map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => {
                                            setDays(option.value);
                                            setIsDateDropdownOpen(false);
                                        }}
                                        className={`w-full text-left px-4 py-2 text-sm font-medium transition-colors ${
                                            days === option.value
                                                ? "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
                                                : "text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800"
                                        }`}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="bg-white dark:bg-zinc-900/40 dark:backdrop-blur-xl p-5 rounded-2xl border border-zinc-200/60 dark:border-zinc-800 shadow-[0_2px_20px_rgb(0,0,0,0.04)] dark:shadow-none flex items-start justify-between">
                    <div>
                        <p className="text-sm font-bold text-blue-600 dark:text-blue-500">Total Feedback</p>
                        <h3 className="text-3xl font-extrabold text-zinc-900 dark:text-white mt-2 mb-2">
                            {totalFeedbacks.toLocaleString()}
                        </h3>
                        <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                            {trends.total} <span className="text-zinc-400 font-medium">from last week</span>
                        </span>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-current rounded-md flex items-center justify-center">
                            <span className="w-2 h-2 bg-current rounded-full"></span>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-zinc-900/40 dark:backdrop-blur-xl p-5 rounded-2xl border border-zinc-200/60 dark:border-zinc-800 shadow-[0_2px_20px_rgb(0,0,0,0.04)] dark:shadow-none flex items-start justify-between">
                    <div>
                        <p className="text-sm font-bold text-emerald-600 dark:text-emerald-500">Positive</p>
                        <h3 className="text-3xl font-extrabold text-zinc-900 dark:text-white mt-2 mb-2">
                            {positive.toLocaleString()}
                        </h3>
                        <span
                            className={`text-xs font-semibold ${trends.pos.startsWith("-") ? "text-rose-500 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400"}`}
                        >
                            {trends.pos} <span className="text-zinc-400 font-medium">from last week</span>
                        </span>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                        <CheckCircle2 size={20} />
                    </div>
                </div>

                <div className="bg-white dark:bg-zinc-900/40 dark:backdrop-blur-xl p-5 rounded-2xl border border-zinc-200/60 dark:border-zinc-800 shadow-[0_2px_20px_rgb(0,0,0,0.04)] dark:shadow-none flex items-start justify-between">
                    <div>
                        <p className="text-sm font-bold text-rose-600 dark:text-rose-500">Negative</p>
                        <h3 className="text-3xl font-extrabold text-zinc-900 dark:text-white mt-2 mb-2">
                            {negative.toLocaleString()}
                        </h3>
                        <span
                            className={`text-xs font-semibold ${trends.neg.startsWith("+") ? "text-rose-500 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400"}`}
                        >
                            {trends.neg} <span className="text-zinc-400 font-medium">from last week</span>
                        </span>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                        <ShieldAlert size={20} />
                    </div>
                </div>

                <div className="bg-white dark:bg-zinc-900/40 dark:backdrop-blur-xl p-5 rounded-2xl border border-zinc-200/60 dark:border-zinc-800 shadow-[0_2px_20px_rgb(0,0,0,0.04)] dark:shadow-none flex items-start justify-between">
                    <div>
                        <p className="text-sm font-bold text-amber-500 dark:text-amber-500">Neutral</p>
                        <h3 className="text-3xl font-extrabold text-zinc-900 dark:text-white mt-2 mb-2">
                            {neutral.toLocaleString()}
                        </h3>
                        <span className="text-xs font-semibold text-amber-500 dark:text-amber-400">
                            {trends.pend} <span className="text-zinc-400 font-medium">from last week</span>
                        </span>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-500 dark:text-amber-400 flex items-center justify-center">
                        <Clock size={20} />
                    </div>
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Line Chart */}
                <div className="lg:col-span-2 bg-white dark:bg-zinc-900/40 dark:backdrop-blur-xl p-6 rounded-2xl border border-zinc-200/60 dark:border-zinc-800 shadow-[0_2px_20px_rgb(0,0,0,0.04)] dark:shadow-none">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                            Feedback Overview
                        </h3>
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                                <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                                    Positive
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                                <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                                    Negative
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData} margin={{top: 5, right: 10, left: -20, bottom: 0}}>
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
                                    contentStyle={{
                                        borderRadius: "12px",
                                        border: "none",
                                        backgroundColor: "#0f172a",
                                        color: "#fff",
                                        boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                                    }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="Positive"
                                    stroke="#0d9488"
                                    strokeWidth={3}
                                    dot={{r: 4, strokeWidth: 2, fill: "#fff"}}
                                    activeDot={{r: 6}}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="Negative"
                                    stroke="#ef4444"
                                    strokeWidth={3}
                                    dot={{r: 4, strokeWidth: 2, fill: "#fff"}}
                                    activeDot={{r: 6}}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Donut Chart */}
                <div className="bg-white dark:bg-zinc-900/40 dark:backdrop-blur-xl p-6 rounded-2xl border border-zinc-200/60 dark:border-zinc-800 shadow-[0_2px_20px_rgb(0,0,0,0.04)] dark:shadow-none flex flex-col">
                    <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-4">
                        Feedback by Source
                    </h3>
                    {/* Chart centered */}
                    <div className="flex flex-col items-center gap-4 flex-1">
                        <div className="relative" style={{width: 192, height: 192}}>
                            <PieChart width={192} height={192} style={{overflow: "visible"}}>
                                <Pie
                                    data={sourceData}
                                    cx={96}
                                    cy={96}
                                    innerRadius={60}
                                    outerRadius={88}
                                    paddingAngle={2}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {sourceData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: "8px",
                                        border: "none",
                                        backgroundColor: "#0f172a",
                                        color: "#fff",
                                    }}
                                />
                            </PieChart>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-xl font-extrabold text-zinc-900 dark:text-white">
                                    {totalFeedbacks.toLocaleString()}
                                </span>
                                <span className="text-xs font-semibold text-zinc-500">Total</span>
                            </div>
                        </div>
                        {/* Legend below chart */}
                        <div className="grid grid-cols-2 gap-x-6 gap-y-2 w-full">
                            {sourceData.map((item, index) => {
                                const percentage =
                                    totalSourceValue > 0
                                        ? ((item.value / totalSourceValue) * 100).toFixed(1)
                                        : 0;
                                return (
                                    <div key={index} className="flex items-center gap-2">
                                        <div
                                            className="w-2.5 h-2.5 rounded-full shrink-0"
                                            style={{backgroundColor: COLORS[index % COLORS.length]}}
                                        ></div>
                                        <span
                                            className="text-xs font-medium text-zinc-600 dark:text-zinc-400 truncate"
                                            title={item.name}
                                        >
                                            {item.name}
                                        </span>
                                        <span className="text-xs font-bold text-zinc-900 dark:text-white ml-auto">
                                            {percentage}%
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Feedback Table */}
            <div className="bg-white dark:bg-zinc-900/40 dark:backdrop-blur-xl rounded-2xl border border-zinc-200/60 dark:border-zinc-800 shadow-[0_2px_20px_rgb(0,0,0,0.04)] dark:shadow-none overflow-hidden">
                <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
                    <h3 className="text-base font-bold text-zinc-900 dark:text-white">Recent Feedback</h3>
                    <Link
                        to="/dashboard/feedbacks"
                        className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                        View All <ArrowRight size={16} />
                    </Link>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-50/50 dark:bg-zinc-900/50">
                                <th className="py-4 px-6 text-xs font-bold text-zinc-800 dark:text-zinc-300 whitespace-nowrap">
                                    Customer
                                </th>
                                <th className="py-4 px-6 text-xs font-bold text-zinc-800 dark:text-zinc-300 w-[35%]">
                                    Feedback
                                </th>
                                <th className="py-4 px-6 text-xs font-bold text-zinc-800 dark:text-zinc-300 whitespace-nowrap">
                                    Rating
                                </th>
                                <th className="py-4 px-6 text-xs font-bold text-zinc-800 dark:text-zinc-300 whitespace-nowrap">
                                    Category
                                </th>
                                <th className="py-4 px-6 text-xs font-bold text-zinc-800 dark:text-zinc-300 whitespace-nowrap">
                                    Status
                                </th>
                                <th className="py-4 px-6 text-xs font-bold text-zinc-800 dark:text-zinc-300 whitespace-nowrap">
                                    Date
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                            {recentFeedbacks.length > 0 ? (
                                recentFeedbacks.map((item, i) => {
                                    const name = item.customerName || "Anonymous User";
                                    const initial = name.charAt(0).toUpperCase();

                                    let category = "Product";
                                    if (item.themes && item.themes.length > 0)
                                        category = item.themes[0].name || item.themes[0];
                                    else if (item.category) category = item.category;

                                    const status =
                                        item.sentiment === "POS"
                                            ? "Positive"
                                            : item.sentiment === "NEG"
                                              ? "Negative"
                                              : "Neutral";
                                    const statusColor =
                                        status === "Positive"
                                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                                            : status === "Negative"
                                              ? "bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400"
                                              : "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-500";

                                    return (
                                        <tr
                                            key={item._id || i}
                                            className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors"
                                        >
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-full bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 flex items-center justify-center font-bold text-sm shrink-0">
                                                        {initial}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-bold text-zinc-900 dark:text-white">
                                                            {name}
                                                        </div>
                                                        <div className="text-xs text-zinc-500">
                                                            {name.toLowerCase().replace(" ", ".")}@email.com
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-sm text-zinc-600 dark:text-zinc-300 font-medium">
                                                <div className="line-clamp-1">{item.content}</div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex gap-1">
                                                    {[1, 2, 3, 4, 5].map((star) => {
                                                        const isFilled =
                                                            item.sentiment === "POS"
                                                                ? true
                                                                : item.sentiment === "NEU"
                                                                  ? star <= 3
                                                                  : star <= 1;
                                                        return (
                                                            <Star
                                                                key={star}
                                                                size={14}
                                                                className={
                                                                    isFilled
                                                                        ? "fill-amber-400 text-amber-400"
                                                                        : "fill-zinc-200 text-zinc-200 dark:fill-zinc-700 dark:text-zinc-700"
                                                                }
                                                            />
                                                        );
                                                    })}
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                                                    {category}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span
                                                    className={`inline-flex items-center justify-center px-2.5 py-1 rounded-md text-xs font-bold ${statusColor}`}
                                                >
                                                    {status}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-sm font-semibold text-zinc-600 dark:text-zinc-400">
                                                {item.createdAt
                                                    ? new Date(item.createdAt).toLocaleDateString("en-US", {
                                                          month: "short",
                                                          day: "numeric",
                                                          year: "numeric",
                                                      })
                                                    : "May 18, 2024"}
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="6" className="py-8 text-center text-sm text-zinc-500">
                                        No recent feedback found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
