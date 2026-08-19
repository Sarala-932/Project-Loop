import { api } from "../../../lib/api";

export const getReportsApi = async () => {
  const res = await api.get("/reports");
  return res.data.reports;
};

export const generateReportApi = async (days) => {
  const res = await api.post("/reports/generate", { days });
  return res.data.report;
};
