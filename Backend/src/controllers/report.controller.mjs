import { generateReportService, getReportsService, getReportByIdService } from "../services/report.service.mjs";

export const generateReport = async (req, res) => {
    try {
        const workspaceId = req.user.workspaceId;
        const generatedBy = req.user.userId; // User who is generating the report
        const days = req.body.days ? parseInt(req.body.days) : 7;
        
        const report = await generateReportService(workspaceId, generatedBy, days);
        
        res.status(201).json({ message: "Report generated successfully", report });
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

export const getReports = async (req, res) => {
    try {
        const workspaceId = req.user.workspaceId;
        const reports = await getReportsService(workspaceId);
        
        res.status(200).json({ reports });
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

export const getReportById = async (req, res) => {
    try {
        const workspaceId = req.user.workspaceId;
        const reportId = req.params.id;
        
        const report = await getReportByIdService(workspaceId, reportId);
        
        res.status(200).json({ report });
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};
