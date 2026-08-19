import {create} from "zustand";
import {getReportsApi, generateReportApi} from "../services/reportService";
import {toast} from "sonner";

export const useReportStore = create((set, get) => ({
    reports: [],
    isLoading: false,
    isGenerating: false,
    reportDays: 7,

    setReportDays: (days) => set({reportDays: days}),

    fetchReports: async () => {
        if (get().reports.length > 0) return;

        set({isLoading: true});
        try {
            const data = await getReportsApi();
            set({reports: data || []});
        } catch (error) {
            toast.error("Failed to load reports");
        } finally {
            set({isLoading: false});
        }
    },

    generateReport: async () => {
        const days = get().reportDays;
        set({isGenerating: true});
        try {
            const newReport = await generateReportApi(days);
            set((state) => ({reports: [newReport, ...state.reports]}));
            toast.success(`Report for last ${days} days generated successfully!`);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to generate report");
        } finally {
            set({isGenerating: false});
        }
    },
}));
