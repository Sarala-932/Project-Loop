import { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { Search, Filter, Download, Upload, MoreHorizontal, MessageSquare, Tag, Loader2, X, Plus, Trash2, RefreshCw, Link as LinkIcon, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { RoleGate } from "../../../components/RoleGate";
import { useFeedbacks } from "../hooks/useFeedbacks";
import { feedbackService } from "../services/feedbackService";
import { toast } from "sonner";

const categoryColors = {
  "Performance": "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
  "Feature Request": "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  "Praise": "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  "Bug": "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
  "Pricing": "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
};

export const FeedbacksPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { feedbacks, isLoading, error, refreshFeedbacks, page, setPage, totalPages, totalFeedbacks, updateFeedbackInList } = useFeedbacks();
  
  // Modal state & Exit animation handling
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  
  // Local loading state for re-running AI
  const [reclassifyingId, setReclassifyingId] = useState(null);

  const handleCloseModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsModalOpen(false);
      setIsClosing(false);
    }, 280); // Wait for the animate-out classes to finish
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setIsClosing(false);
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newFeedback, setNewFeedback] = useState({
    customerName: "",
    text: "",
    channel: "Web App"
  });

  const [activeFilters, setActiveFilters] = useState({ sentiment: 'ALL', status: 'ALL' });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Advanced local filter based on search term AND active filters
  const filteredFeedbacks = (feedbacks || []).filter(fb => {
    // 1. Search term match
    const term = (searchTerm || "").toLowerCase();
    const contentMatch = fb.content?.toLowerCase().includes(term);
    const authorMatch = fb.customerName?.toLowerCase().includes(term) || fb.authorName?.toLowerCase().includes(term) || fb.user?.name?.toLowerCase().includes(term);
    const matchesSearch = !term || contentMatch || authorMatch;

    // 2. Sentiment filter
    const matchesSentiment = activeFilters.sentiment === 'ALL' || fb.sentiment === activeFilters.sentiment;

    // 3. Status filter
    const matchesStatus = activeFilters.status === 'ALL' || fb.status === activeFilters.status;

    return matchesSearch && matchesSentiment && matchesStatus;
  });

  const fileInputRef = useRef(null);
  const [isImporting, setIsImporting] = useState(false);

  const handleImportCSV = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate if it's a CSV file
    if (file.type !== "text/csv" && !file.name.endsWith('.csv')) {
        toast.error("Please upload a valid CSV file");
        return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setIsImporting(true);
    const toastId = toast.loading("Uploading and analyzing feedbacks via AI...");

    try {
        await feedbackService.uploadFeedbacks(formData);
        toast.success("Feedbacks imported successfully!", { id: toastId });
        refreshFeedbacks(); // Refresh the list
    } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to import CSV", { id: toastId });
    } finally {
        setIsImporting(false);
        // Reset file input
        if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleExportCSV = (e) => {
    e.preventDefault();
    if (!filteredFeedbacks || filteredFeedbacks.length === 0) {
      toast.info("No feedbacks to export.");
      return;
    }
    
    try {
      const headers = ['ID', 'Customer Name', 'Source', 'Status', 'Content', 'Date'];
      const csvRows = [headers.join(',')];
      
      filteredFeedbacks.forEach(fb => {
        const name = fb.customerName || fb.user?.name || fb.authorName || 'Anonymous';
        const row = [
          fb._id || fb.id || '',
          `"${String(name).replace(/"/g, '""')}"`,
          `"${String(fb.source || 'Web App').replace(/"/g, '""')}"`,
          `"${String(fb.status || 'NEW').replace(/"/g, '""')}"`,
          `"${String(fb.content || '').replace(/"/g, '""')}"`,
          `"${fb.createdAt ? new Date(fb.createdAt).toLocaleDateString() : (fb.date || '')}"`
        ];
        csvRows.push(row.join(','));
      });
      
      const csvString = csvRows.join('\n');
      console.log("Generated CSV Data:", csvString); 
      
      const blob = new Blob(["\uFEFF" + csvString], { type: 'text/csv;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = 'loop_feedbacks.csv';
      
      document.body.appendChild(link);
      link.click();
      
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 500);
      
      toast.success("CSV Exported successfully!");
    } catch (err) {
      console.error("Error generating CSV: ", err);
      toast.error("Failed to generate CSV.");
    }
  };

  const handleAddFeedback = async (e) => {
    e.preventDefault();
    if (!newFeedback.text.trim()) {
      toast.error("Feedback content is required.");
      return;
    }
    
    setIsSubmitting(true);
    try {
      await feedbackService.createFeedback(newFeedback);
      toast.success("Feedback added successfully!");
      handleCloseModal();
      setNewFeedback({ customerName: "", text: "", channel: "Web App" });
      refreshFeedbacks(); // Refresh the list from backend
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to add feedback.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const [openDropdownId, setOpenDropdownId] = useState(null);

  const handleUpdateStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'NEW' ? 'REVIEWED' : currentStatus === 'REVIEWED' ? 'ACTIONED' : 'NEW';
    try {
      await feedbackService.updateFeedback(id, { status: nextStatus });
      toast.success(`Status updated to ${nextStatus}`);
      refreshFeedbacks();
    } catch (err) {
      toast.error("Failed to update status.");
    }
    setOpenDropdownId(null);
  };

  const handleReRunAI = async (id) => {
    setOpenDropdownId(null);
    setReclassifyingId(id);
    try {
      const response = await feedbackService.reclassifyFeedback(id);
      
      // The backend returns { message: "...", feedback: { ... } }
      const updatedFeedback = response.feedback || response;
      
      // The backend doesn't populate 'themes' on reclassify, it just returns ObjectIds.
      // But it DOES return 'ai_themes' which is an array of string names (e.g. ["UI", "Bug"]).
      // Let's format it so the UI map function correctly reads `t.name` without needing a full refresh.
      if (updatedFeedback.ai_themes) {
        updatedFeedback.themes = updatedFeedback.ai_themes.map(name => ({ name }));
      }

      // Update locally without triggering a full page reload/spinner
      updateFeedbackInList(id, updatedFeedback);
      toast.success("AI Analysis complete! ✨");
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to re-run AI.');
    } finally {
      setReclassifyingId(null);
    }
  };

  const handleCopyLink = (id) => {
    navigator.clipboard.writeText(`${window.location.origin}/dashboard/feedbacks/${id}`);
    toast.success("Link copied to clipboard!");
    setOpenDropdownId(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this feedback?")) return;
    try {
      await feedbackService.deleteFeedback(id);
      toast.success("Feedback deleted!");
      refreshFeedbacks();
    } catch (err) {
      toast.error("Failed to delete.");
    }
    setOpenDropdownId(null);
  };

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500 ease-out pb-10">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">Feedbacks</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Manage, analyze, and reply to customer feedback.</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Hidden File Input for CSV Import */}
          <input 
            type="file" 
            accept=".csv" 
            ref={fileInputRef} 
            style={{ display: "none" }} 
            onChange={handleImportCSV} 
          />

          <RoleGate allowedRoles={['ADMIN', 'ANALYST']}>
            <button 
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isImporting}
              className="flex items-center gap-2 bg-white dark:bg-zinc-900/40 dark:backdrop-blur-xl border border-zinc-200/60 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 px-4 py-2 rounded-xl text-sm font-bold hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all shadow-[0_2px_20px_rgb(0,0,0,0.04)] dark:shadow-none disabled:opacity-50"
            >
              {isImporting ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />} 
              {isImporting ? "Importing..." : "Import CSV"}
            </button>
          </RoleGate>

          <button 
            type="button"
            onClick={handleExportCSV}
            className="flex items-center gap-2 bg-white dark:bg-zinc-900/40 dark:backdrop-blur-xl border border-zinc-200/60 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 px-4 py-2 rounded-xl text-sm font-bold hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all shadow-[0_2px_20px_rgb(0,0,0,0.04)] dark:shadow-none"
          >
            <Download size={16} /> Export CSV
          </button>
          <RoleGate allowedRoles={['ADMIN', 'ANALYST']}>
            <button 
              onClick={handleOpenModal}
              className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-emerald-700 transition-all shadow-[0_2px_20px_rgb(0,0,0,0.04)] dark:shadow-none shadow-emerald-500/20"
            >
              <Plus size={16} /> Add Feedback
            </button>
          </RoleGate>
        </div>
      </div>

      {/* Filters & Search Bar */}
      <div className="relative z-20 flex flex-col sm:flex-row justify-between items-center bg-white dark:bg-zinc-900/40 dark:backdrop-blur-xl p-4 rounded-2xl border border-zinc-200/60 dark:border-zinc-800 mb-6 gap-4 shadow-[0_2px_20px_rgb(0,0,0,0.04)] dark:shadow-none">
        <div className="relative w-full sm:w-96">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input 
            type="text" 
            placeholder="Search feedbacks by keyword..." 
            className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/60 dark:border-zinc-800 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none text-zinc-900 dark:text-white transition-all font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto relative">
          
          {/* Active Filter Indicators */}
          {(activeFilters.sentiment !== 'ALL' || activeFilters.status !== 'ALL') && (
            <div className="hidden sm:flex items-center gap-2 mr-2">
              <span className="text-xs font-semibold text-zinc-400">Active Filters:</span>
              <button 
                onClick={() => setActiveFilters({ sentiment: 'ALL', status: 'ALL' })}
                className="text-xs text-rose-500 hover:text-rose-600 font-bold hover:underline"
              >
                Clear All
              </button>
            </div>
          )}

          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold rounded-xl transition-all w-full sm:w-auto justify-center border ${
              isFilterOpen || activeFilters.sentiment !== 'ALL' || activeFilters.status !== 'ALL'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20'
                : 'text-zinc-600 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-950 border-zinc-200/60 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            <Filter size={16} /> Filters
            {(activeFilters.sentiment !== 'ALL' || activeFilters.status !== 'ALL') && (
              <span className="flex h-2 w-2 rounded-full bg-emerald-600 absolute top-2 right-3 sm:right-2"></span>
            )}
          </button>

          {/* Filter Dropdown Menu */}
          {isFilterOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setIsFilterOpen(false)}></div>
              <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 rounded-2xl shadow-xl z-50 p-4 animate-in fade-in zoom-in-95 duration-100">
                <div className="mb-4">
                  <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Sentiment</h4>
                  <div className="flex flex-wrap gap-2">
                    {['ALL', 'POS', 'NEG', 'NEU'].map(sent => (
                      <button
                        key={sent}
                        onClick={() => setActiveFilters({ ...activeFilters, sentiment: sent })}
                        className={`px-3 py-1 text-xs font-bold rounded-lg border ${
                          activeFilters.sentiment === sent 
                            ? 'bg-emerald-600 text-white border-emerald-600' 
                            : 'bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border-zinc-200/60 dark:border-zinc-700 hover:border-emerald-400'
                        }`}
                      >
                        {sent === 'ALL' ? 'Any' : sent === 'POS' ? 'Positive' : sent === 'NEG' ? 'Negative' : 'Neutral'}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Status</h4>
                  <div className="flex flex-col gap-1.5">
                    {['ALL', 'NEW', 'REVIEWED', 'ACTIONED'].map(stat => (
                      <button
                        key={stat}
                        onClick={() => setActiveFilters({ ...activeFilters, status: stat })}
                        className={`flex items-center justify-between px-3 py-2 text-sm font-semibold rounded-lg ${
                          activeFilters.status === stat 
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' 
                            : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                        }`}
                      >
                        {stat === 'ALL' ? 'Any Status' : stat}
                        {activeFilters.status === stat && <CheckCircle size={14} />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Feedback List Container */}
      <div className="bg-white dark:bg-zinc-900/40 dark:backdrop-blur-xl border border-zinc-200/60 dark:border-zinc-800 rounded-2xl shadow-[0_2px_20px_rgb(0,0,0,0.04)] dark:shadow-none min-h-[400px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full p-20 opacity-50">
            <Loader2 className="animate-spin text-emerald-500 mb-4" size={32} />
            <p className="text-sm font-medium text-zinc-500">Loading feedbacks from server...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-full p-20">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 text-red-500 rounded-xl flex items-center justify-center mb-4">
              <Tag size={24} />
            </div>
            <p className="text-sm font-medium text-red-500 dark:text-red-400">{error}</p>
          </div>
        ) : filteredFeedbacks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-20">
            <p className="text-sm font-medium text-zinc-500">No feedbacks found.</p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
            {filteredFeedbacks.map((fb) => {
              const userName = fb.customerName || fb.user?.name || fb.authorName || 'Anonymous';
              const userAvatar = userName.charAt(0).toUpperCase();
              
              // Handle populated themes array or fallback
              let category = 'Uncategorized';
              if (fb.themes && fb.themes.length > 0) {
                  category = fb.themes.map(t => t.name || t).join(', ');
              } else if (fb.category || fb.theme) {
                  category = fb.category || fb.theme;
              }
              
              const status = fb.status || 'NEW';
              const dateStr = fb.createdAt ? new Date(fb.createdAt).toLocaleDateString() : (fb.date || 'Recently');

              return (
                <div 
                  key={fb.id || fb._id} 
                  className={`relative p-6 transition-colors group cursor-pointer first:rounded-t-2xl last:rounded-b-2xl ${openDropdownId === (fb.id || fb._id) ? "z-50" : "z-10"} ${
                    reclassifyingId === (fb.id || fb._id) 
                      ? 'bg-zinc-50 dark:bg-zinc-800/50 opacity-60 pointer-events-none' 
                      : 'hover:bg-zinc-50/50 dark:hover:bg-zinc-950/40'
                  }`}
                >
                  {reclassifyingId === (fb.id || fb._id) && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center backdrop-blur-[1px] rounded-inherit">
                      <div className="bg-white dark:bg-zinc-900/40 dark:backdrop-blur-xl shadow-lg px-4 py-2 rounded-full flex items-center gap-2 border border-zinc-200/60 dark:border-zinc-800">
                        <Loader2 size={16} className="animate-spin text-emerald-600" />
                        <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Re-running AI...</span>
                      </div>
                    </div>
                  )}
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                    
                    {/* User Avatar */}
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold text-lg shadow-inner">
                        {userAvatar}
                      </div>
                    </div>
                    
                    {/* Feedback Content */}
                    <div className="flex-grow min-w-0">
                      
                      {/* Top Row: Name, Date, Tags */}
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-3">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-zinc-900 dark:text-white">{userName}</h3>
                          <span className="text-zinc-300 dark:text-zinc-600">•</span>
                          <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{dateStr}</span>
                          {fb.source && (
                            <>
                              <span className="text-zinc-300 dark:text-zinc-600">•</span>
                              <span className="text-xs font-medium text-zinc-400">{fb.source}</span>
                            </>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-1 text-[11px] font-bold rounded-md border uppercase tracking-wide ${categoryColors[category] || 'bg-zinc-100 text-zinc-600 border-zinc-200/60 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700'}`}>
                            {category}
                          </span>
                          <span className="px-2.5 py-1 text-[11px] font-bold rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200/60 dark:border-zinc-700 uppercase tracking-wide">
                            {status}
                          </span>
                        </div>
                      </div>
                      
                      {/* The Feedback Text */}
                      <p className="text-zinc-700 dark:text-zinc-300 text-sm leading-relaxed mb-4">
                        "{fb.content}"
                      </p>
                      
                      {/* Bottom Row: Actions */}
                      <RoleGate allowedRoles={['ADMIN', 'ANALYST']}>
                        <div className="flex items-center gap-5 text-xs font-semibold text-zinc-500 dark:text-zinc-400 mt-4">
                          <button className="flex items-center gap-1.5 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                            <MessageSquare size={14} /> Reply to user
                          </button>
                          <button className="flex items-center gap-1.5 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                            <Tag size={14} /> Edit AI Tags
                          </button>
                        </div>
                      </RoleGate>
                    </div>
                    
                    {/* Context Menu Icon (appears on hover) */}
                    <RoleGate allowedRoles={['ADMIN', 'ANALYST']}>
                      <div className="flex-shrink-0 flex sm:flex-col items-start sm:items-center justify-center lg:opacity-0 group-hover:opacity-100 transition-opacity mt-4 sm:mt-0">
                        <div className="relative">
                          <button 
                            onClick={() => setOpenDropdownId(openDropdownId === (fb.id || fb._id) ? null : (fb.id || fb._id))}
                            className="p-2 text-zinc-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-xl transition-colors"
                          >
                            <MoreHorizontal size={20} />
                          </button>
                          
                          {openDropdownId === (fb.id || fb._id) && (
                            <>
                              <div className="fixed inset-0 z-10" onClick={() => setOpenDropdownId(null)}></div>
                              <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 rounded-xl shadow-lg z-50 py-2 animate-in fade-in zoom-in-95 duration-100">
                                <button onClick={() => handleUpdateStatus(fb.id || fb._id, status)} className="w-full text-left px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 flex items-center gap-2">
                                  <CheckCircle size={14} className="text-emerald-500" /> {status === 'NEW' ? 'Mark as Reviewed' : status === 'REVIEWED' ? 'Mark as Actioned' : 'Mark as New'}
                                </button>
                                <button onClick={() => handleReRunAI(fb.id || fb._id)} className="w-full text-left px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 flex items-center gap-2">
                                  <RefreshCw size={14} className="text-blue-500" /> Re-run AI Analysis
                                </button>
                                <button onClick={() => handleCopyLink(fb.id || fb._id)} className="w-full text-left px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 flex items-center gap-2">
                                  <LinkIcon size={14} className="text-emerald-500" /> Copy ID / Link
                                </button>
                                <div className="h-px bg-zinc-100 dark:bg-zinc-800 my-1"></div>
                                <button onClick={() => handleDelete(fb.id || fb._id)} className="w-full text-left px-4 py-2 text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 flex items-center gap-2">
                                  <Trash2 size={14} /> Delete Feedback
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </RoleGate>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 bg-white dark:bg-zinc-900/40 dark:backdrop-blur-xl border border-zinc-200/60 dark:border-zinc-800 p-4 rounded-2xl shadow-[0_2px_20px_rgb(0,0,0,0.04)] dark:shadow-none">
          <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            Showing page <span className="text-zinc-900 dark:text-white font-bold">{page}</span> of <span className="text-zinc-900 dark:text-white font-bold">{totalPages}</span> ({totalFeedbacks} total)
          </span>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200/60 dark:border-zinc-700 rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="flex items-center gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-8 h-8 rounded-lg text-sm font-bold transition-colors ${page === i + 1 ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button 
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200/60 dark:border-zinc-700 rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
      
      {/* Add Feedback Modal */}
      {isModalOpen && createPortal(
        <div 
          className={`fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-900/50 backdrop-blur-sm ${isClosing ? 'animate-out fade-out duration-300' : 'animate-in fade-in duration-300'}`}
          onMouseDown={(e) => { if(e.target === e.currentTarget) handleCloseModal(); }}
        >
          <div className={`bg-white dark:bg-zinc-900/40 dark:backdrop-blur-xl rounded-3xl shadow-2xl border border-zinc-200/60 dark:border-zinc-800 w-full max-w-lg overflow-hidden ${isClosing ? 'animate-out fade-out zoom-out-50 slide-out-to-top-24 slide-out-to-right-24 duration-300 ease-in' : 'animate-in fade-in zoom-in-50 slide-in-from-top-24 slide-in-from-right-24 duration-300 ease-out'} origin-top-right fill-mode-forwards`}>
            <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-800/20">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Add Manual Feedback</h2>
              <button 
                onClick={handleCloseModal}
                className="p-2 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleAddFeedback} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">Customer Name (Optional)</label>
                <input 
                  type="text"
                  value={newFeedback.customerName}
                  onChange={(e) => setNewFeedback({...newFeedback, customerName: e.target.value})}
                  className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/60 dark:border-zinc-700 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none text-zinc-900 dark:text-white transition-all"
                  placeholder="e.g. John Doe"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">Source</label>
                <select 
                  value={newFeedback.channel}
                  onChange={(e) => setNewFeedback({...newFeedback, channel: e.target.value})}
                  className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/60 dark:border-zinc-700 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none text-zinc-900 dark:text-white transition-all cursor-pointer"
                >
                  <option value="Web App">Web App</option>
                  <option value="Mobile App">Mobile App</option>
                  <option value="Twitter">Twitter</option>
                  <option value="Support Email">Support Email</option>
                  <option value="Manual Entry">Manual Entry</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">Feedback Content <span className="text-rose-500">*</span></label>
                <textarea 
                  required
                  value={newFeedback.text}
                  onChange={(e) => setNewFeedback({...newFeedback, text: e.target.value})}
                  rows={4}
                  className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/60 dark:border-zinc-700 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none text-zinc-900 dark:text-white transition-all resize-none"
                  placeholder="What did the customer say?"
                ></textarea>
              </div>
              
              <div className="pt-2 flex items-center justify-end gap-3">
                <button 
                  type="button"
                  onClick={handleCloseModal}
                  className="px-5 py-2.5 text-sm font-bold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting || !newFeedback.text.trim()}
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:hover:bg-emerald-600 rounded-xl transition-colors shadow-[0_2px_20px_rgb(0,0,0,0.04)] dark:shadow-none shadow-emerald-500/20"
                >
                  {isSubmitting ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : "Add Feedback"}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
