import { useState } from "react";
import { createPortal } from "react-dom";
import { FileText, Plus, Loader2, Calendar, X } from "lucide-react";
import { RoleGate } from "../../../components/RoleGate";
import { useReports } from "../hooks/useReports";

export const Reports = () => {
  const { 
    reports, 
    isLoading, 
    isGenerating, 
    reportDays, 
    setReportDays, 
    generateReport 
  } = useReports();

  const [selectedReport, setSelectedReport] = useState(null);
  const [isClosing, setIsClosing] = useState(false);

  const handleGenerateReport = async () => {
    await generateReport();
  };

  const handleOpenReport = (report) => {
    setSelectedReport(report);
    setIsClosing(false);
  };

  const handleCloseReport = () => {
    setIsClosing(true);
    setTimeout(() => {
      setSelectedReport(null);
      setIsClosing(false);
    }, 280);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight flex items-center gap-2">
            <FileText size={24} className="text-emerald-600" /> AI Reports
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Generate and view weekly AI summaries of your customer feedback.
          </p>
        </div>
        <RoleGate allowedRoles={["ADMIN", "ANALYST"]}>
          <div className="flex items-center gap-2">
            <select
                value={reportDays}
                onChange={(e) => setReportDays(Number(e.target.value))}
                className="bg-white dark:bg-zinc-900/40 dark:backdrop-blur-xl border border-zinc-200/60 dark:border-zinc-800 rounded-xl px-3 py-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300 outline-none cursor-pointer hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors"
                disabled={isGenerating}
            >
                <option value={7}>Last 7 Days</option>
                <option value={30}>Last 30 Days</option>
                <option value={90}>Last 3 Months</option>
                <option value={180}>Last 6 Months</option>
            </select>
            <button
              onClick={handleGenerateReport}
              disabled={isGenerating}
              className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-emerald-700 disabled:opacity-50 transition-all shadow-[0_2px_20px_rgb(0,0,0,0.04)] dark:shadow-none shadow-emerald-500/20 shrink-0"
            >
              {isGenerating ? <><Loader2 size={16} className="animate-spin" /> Generating...</> : <><Plus size={16} /> Generate Report</>}
            </button>
          </div>
        </RoleGate>
      </div>

      {/* Reports Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-emerald-500" size={32} />
        </div>
      ) : reports.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900/40 dark:backdrop-blur-xl border border-zinc-200/60 dark:border-zinc-800 rounded-2xl p-12 text-center shadow-[0_2px_20px_rgb(0,0,0,0.04)] dark:shadow-none">
          <FileText className="mx-auto text-zinc-300 dark:text-zinc-700 mb-4" size={48} />
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">No Reports Yet</h3>
          <p className="text-zinc-500 mb-6">Generate your first AI-driven report to uncover deep insights.</p>
          <RoleGate allowedRoles={["ADMIN", "ANALYST"]}>
            <div className="flex items-center justify-center gap-2">
                <select
                    value={reportDays}
                    onChange={(e) => setReportDays(Number(e.target.value))}
                    className="bg-white dark:bg-zinc-900/40 dark:backdrop-blur-xl border border-zinc-200/60 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-sm font-semibold text-zinc-700 dark:text-zinc-300 outline-none cursor-pointer"
                    disabled={isGenerating}
                >
                    <option value={7}>Last 7 Days</option>
                    <option value={30}>Last 30 Days</option>
                    <option value={90}>Last 3 Months</option>
                    <option value={180}>Last 6 Months</option>
                </select>
                <button
                onClick={handleGenerateReport}
                disabled={isGenerating}
                className="inline-flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-700 transition-all"
                >
                {isGenerating ? "Generating..." : "Generate Report"}
                </button>
            </div>
          </RoleGate>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {reports.map((report) => (
            <div 
              key={report._id} 
              onClick={() => handleOpenReport(report)}
              className="bg-white dark:bg-zinc-900/40 dark:backdrop-blur-xl border border-zinc-200/60 dark:border-zinc-800 rounded-2xl p-5 shadow-[0_2px_20px_rgb(0,0,0,0.04)] dark:shadow-none hover:shadow-md hover:border-emerald-300 dark:hover:border-emerald-700/50 cursor-pointer transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="bg-emerald-50 dark:bg-emerald-500/10 p-2.5 rounded-xl">
                  <FileText className="text-emerald-600 dark:text-emerald-400" size={20} />
                </div>
                <div className="text-xs font-semibold text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 rounded-md">
                  {new Date(report.createdAt).toLocaleDateString()}
                </div>
              </div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-2 group-hover:text-emerald-600 transition-colors">
                {report.title}
              </h3>
              <div className="flex items-center gap-4 text-xs font-medium text-zinc-500 mb-4">
                <span className="flex items-center gap-1.5"><Calendar size={14} /> {new Date(report.periodStart).toLocaleDateString()} - {new Date(report.periodEnd).toLocaleDateString()}</span>
              </div>
              
              <div className="flex gap-2">
                <span className="text-xs bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20 px-2 py-1 rounded-md font-bold">
                  {report.stats?.positiveCount || 0} Positive
                </span>
                <span className="text-xs bg-rose-50 text-rose-600 border border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20 px-2 py-1 rounded-md font-bold">
                  {report.stats?.negativeCount || 0} Negative
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Report Detail Modal */}
      {selectedReport && createPortal(
        <div
            className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-zinc-900/50 backdrop-blur-sm ${isClosing ? 'animate-out fade-out duration-300' : 'animate-in fade-in duration-300'}`}
            onMouseDown={(e) => { if (e.target === e.currentTarget) handleCloseReport(); }}
        >
            <div className={`relative bg-white dark:bg-zinc-900/40 dark:backdrop-blur-xl border border-zinc-200/60 dark:border-zinc-800 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden origin-top-right fill-mode-forwards ${isClosing ? 'animate-out fade-out zoom-out-50 slide-out-to-top-24 slide-out-to-right-24 duration-300 ease-in' : 'animate-in fade-in zoom-in-50 slide-in-from-top-24 slide-in-from-right-24 duration-300 ease-out'}`}>
                
                {/* Modal Header */}
                <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-800/20 shrink-0">
                    <div>
                        <h2 className="text-lg font-bold text-zinc-900 dark:text-white">{selectedReport.title}</h2>
                        <p className="text-xs text-zinc-500 mt-1">Generated on {new Date(selectedReport.createdAt).toLocaleString()}</p>
                    </div>
                    <button onClick={handleCloseReport} className="p-2 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
                        <X size={18} />
                    </button>
                </div>

                {/* Modal Content */}
                <div className="p-6 overflow-y-auto">
                    {/* Stats Summary */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                        <div className="bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800">
                            <div className="text-xs font-semibold text-zinc-500 mb-1">Total Feedbacks</div>
                            <div className="text-2xl font-bold text-zinc-900 dark:text-white">{selectedReport.stats?.totalFeedbacks || 0}</div>
                        </div>
                        <div className="bg-emerald-50 dark:bg-emerald-500/10 p-4 rounded-xl border border-emerald-100 dark:border-emerald-500/20">
                            <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">Positive</div>
                            <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">{selectedReport.stats?.positiveCount || 0}</div>
                        </div>
                        <div className="bg-rose-50 dark:bg-rose-500/10 p-4 rounded-xl border border-rose-100 dark:border-rose-500/20">
                            <div className="text-xs font-semibold text-rose-600 dark:text-rose-400 mb-1">Negative</div>
                            <div className="text-2xl font-bold text-rose-700 dark:text-rose-300">{selectedReport.stats?.negativeCount || 0}</div>
                        </div>
                        <div className="bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800">
                            <div className="text-xs font-semibold text-zinc-500 mb-1">Negative %</div>
                            <div className="text-2xl font-bold text-zinc-900 dark:text-white">{selectedReport.stats?.negativePercentage || 0}%</div>
                        </div>
                    </div>

                    {/* Narrative Markdown */}
                    <div className="prose prose-sm sm:prose-base dark:prose-invert prose-violet max-w-none">
                        {selectedReport.narrative.split('\n').map((line, i) => {
                            if (line.startsWith('### ')) return <h3 key={i} className="text-lg font-bold mt-6 mb-3">{line.replace('### ', '')}</h3>;
                            if (line.startsWith('## ')) return <h2 key={i} className="text-xl font-bold mt-8 mb-4 border-b pb-2">{line.replace('## ', '')}</h2>;
                            if (line.startsWith('# ')) return <h1 key={i} className="text-2xl font-bold mt-8 mb-4">{line.replace('# ', '')}</h1>;
                            if (line.startsWith('- ') || line.startsWith('* ')) return <li key={i} className="ml-4 mb-1">{line.substring(2)}</li>;
                            if (line.trim() === '') return <br key={i} />;
                            return <p key={i} className="mb-3 leading-relaxed text-zinc-700 dark:text-zinc-300">{line}</p>;
                        })}
                    </div>
                </div>
            </div>
        </div>,
        document.body
      )}
    </div>
  );
};
