import { getDashboardStatsService, getThemeTrendsService, askLoopRAGService } from "../services/analytics.service.mjs";

export const getDashboardStats = async (req, res) => {
    try {
        const workspaceId = req.user.workspaceId;
        const days = req.query.days ? parseInt(req.query.days) : 30;
        const stats = await getDashboardStatsService(workspaceId, days);
        
        res.status(200).json(stats);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

export const getThemeTrends = async (req, res) => {
    try {
        const workspaceId = req.user.workspaceId;
        const days = req.query.days ? parseInt(req.query.days) : 7;
        const trends = await getThemeTrendsService(workspaceId, days);
        
        res.status(200).json({ trends });
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

export const askLoop = async (req, res) => {
    try {
        const workspaceId = req.user.workspaceId;
        const { question } = req.body;
        
        const answer = await askLoopRAGService(workspaceId, question);
        
        res.status(200).json({ answer });
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};
