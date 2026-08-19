import mongoose from "mongoose";
import Report from "../models/report.model.mjs";
import { generateVoCNarrative } from "./ai.service.mjs";
import createError from "../utils/createError.mjs";

export const generateReportService = async (workspaceId, generatedBy, days = 7) => {
    // 1. Calculate Period
    const now = new Date();
    const periodStart = new Date(now);
    periodStart.setDate(periodStart.getDate() - days);
    const periodEnd = now;

    // 2. Pre-compute stats 
    const statsPipeline = [
        {
            $match: {
                workspaceId: new mongoose.Types.ObjectId(workspaceId),
                createdAt: { $gte: periodStart, $lte: periodEnd }
            }
        },
        {
            $group: {
                _id: null,
                totalFeedbacks: { $sum: 1 },
                positiveCount: { $sum: { $cond: [{ $eq: ["$sentiment", "POS"] }, 1, 0] } },
                negativeCount: { $sum: { $cond: [{ $eq: ["$sentiment", "NEG"] }, 1, 0] } },
                neutralCount: { $sum: { $cond: [{ $eq: ["$sentiment", "NEU"] }, 1, 0] } },
            }
        }
    ];

    const topThemesPipeline = [
        {
            $match: {
                workspaceId: new mongoose.Types.ObjectId(workspaceId),
                createdAt: { $gte: periodStart, $lte: periodEnd }
            }
        },
        { $unwind: "$themes" },
        {
            $group: {
                _id: "$themes",
                count: { $sum: 1 },
            }
        },
        { $sort: { count: -1 } },
        { $limit: 5 },
        {
            $lookup: {
                from: "themes",
                localField: "_id",
                foreignField: "_id",
                as: "themeDetails",
            }
        },
        { $unwind: "$themeDetails" },
        {
            $project: {
                _id: 0,
                name: "$themeDetails.name",
                count: 1,
            }
        }
    ];

    const Feedback = mongoose.model("Feedback");
    
    const [statsResult, topThemesResult] = await Promise.all([
        Feedback.aggregate(statsPipeline),
        Feedback.aggregate(topThemesPipeline),
    ]);

    const stats = statsResult[0] || {
        totalFeedbacks: 0,
        positiveCount: 0,
        negativeCount: 0,
        neutralCount: 0,
    };

    const combinedStats = {
        totalFeedbacks: stats.totalFeedbacks,
        positiveCount: stats.positiveCount,
        negativeCount: stats.negativeCount,
        neutralCount: stats.neutralCount,
        topThemes: topThemesResult
    };

    if (combinedStats.totalFeedbacks === 0) {
        throw createError("Not enough data in this period to generate a report.", 400);
    }

    // 3. Generate Narrative via AI
    const narrative = await generateVoCNarrative(combinedStats);

    // 4. Save to Database
    const report = new Report({
        workspaceId,
        generatedBy,
        title: `Voice of Customer Report (Last ${days} Days)`,
        periodStart,
        periodEnd,
        stats: combinedStats,
        narrative
    });

    await report.save();

    return report;
};

export const getReportsService = async (workspaceId) => {
    return await Report.find({ workspaceId }).sort({ createdAt: -1 }).lean();
};

export const getReportByIdService = async (workspaceId, reportId) => {
    const report = await Report.findOne({ _id: reportId, workspaceId }).lean();
    if (!report) {
        throw createError("Report not found", 404);
    }
    return report;
};
