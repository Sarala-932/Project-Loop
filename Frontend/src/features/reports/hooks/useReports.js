import { useEffect } from 'react';
import { useReportStore } from '../store/reportStore';

export const useReports = () => {
  const { 
    reports, 
    isLoading, 
    isGenerating, 
    reportDays, 
    setReportDays, 
    fetchReports, 
    generateReport 
  } = useReportStore();

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  return {
    reports,
    isLoading,
    isGenerating,
    reportDays,
    setReportDays,
    generateReport
  };
};
