import Feedback from "../models/feedback.model.mjs";
import mongoose from "mongoose";
import { askLoopQuestion } from "./ai.service.mjs";

export const getDashboardStatsService = async (workspaceId, days = 30) => {
    const timeAgo = new Date();
    timeAgo.setDate(timeAgo.getDate() - days);

    const statsPipeline = [
        {$match: {
            workspaceId: new mongoose.Types.ObjectId(workspaceId),
            createdAt: {$gte: timeAgo}
        }},
        {
            $group: {
                _id: null,
                totalFeedbacks: {$sum: 1},
                positiveCount: {
                    $sum: {$cond: [{$eq: ["$sentiment", "POS"]}, 1, 0]},
                },
                negativeCount: {
                    $sum: {$cond: [{$eq: ["$sentiment", "NEG"]}, 1, 0]},
                },
                neutralCount: {
                    $sum: {$cond: [{$eq: ["$sentiment", "NEU"]}, 1, 0]},
                },
            },
        },
    ];

    // 2. Get volume over time split by sentiment
    const volumePipeline = [
        {
            $match: {
                workspaceId: new mongoose.Types.ObjectId(workspaceId),
                createdAt: {$gte: timeAgo},
                sentiment: {$in: ["POS", "NEG"]}, // Focus on POS/NEG for the line chart
            },
        },
        {
            $group: {
                _id: {
                    date: {$dateToString: {format: "%Y-%m-%d", date: "$createdAt"}},
                    sentiment: "$sentiment",
                },
                count: {$sum: 1},
            },
        },
        {$sort: {"_id.date": 1}},
    ];

    // 3. Get feedback by source (channel) for the Donut Chart
    const channelPipeline = [
        {$match: {
            workspaceId: new mongoose.Types.ObjectId(workspaceId),
            createdAt: {$gte: timeAgo}
        }},
        {
            $group: {
                _id: "$channel",
                count: {$sum: 1},
            },
        },
    ];

    // 4. Get Top Themes Pipeline
    const topThemesPipeline = [
        {$match: {
            workspaceId: new mongoose.Types.ObjectId(workspaceId),
            createdAt: {$gte: timeAgo}
        }},
        {$unwind: "$themes"},
        {
            $group: {
                _id: "$themes",
                count: {$sum: 1},
            },
        },
        {$sort: {count: -1}},
        {$limit: 5},
        {
            $lookup: {
                from: "themes", // Collection name in MongoDB (lowercase plural)
                localField: "_id",
                foreignField: "_id",
                as: "themeDetails",
            },
        },
        {$unwind: "$themeDetails"},
        {
            $project: {
                _id: 0,
                name: "$themeDetails.name",
                count: 1,
            },
        },
    ];

    // Execute pipelines in parallel
    const [statsResult, volumeResult, channelResult, topThemesResult] = await Promise.all([
        Feedback.aggregate(statsPipeline),
        Feedback.aggregate(volumePipeline),
        Feedback.aggregate(channelPipeline),
        Feedback.aggregate(topThemesPipeline),
    ]);

    const stats = statsResult[0] || {
        totalFeedbacks: 0,
        positiveCount: 0,
        negativeCount: 0,
        neutralCount: 0,
    };

    // Format Volume Result (convert to something easier for the line chart)
    const volumeMap = {};
    volumeResult.forEach((item) => {
        const date = item._id.date;
        const sentiment = item._id.sentiment;
        if (!volumeMap[date]) {
            volumeMap[date] = {date, POS: 0, NEG: 0};
        }
        volumeMap[date][sentiment] = item.count;
    });

    // Sort dates properly
    const volumeOverTime = Object.values(volumeMap).sort((a, b) => new Date(a.date) - new Date(b.date));

    // Format Channel Result
    const channels = {};
    channelResult.forEach((item) => {
        channels[item._id] = item.count;
    });

    // Calculate percentage for stat cards
    const negativePercentage =
        stats.totalFeedbacks === 0 ? 0 : ((stats.negativeCount / stats.totalFeedbacks) * 100).toFixed(1);

    return {
        statCards: {
            totalFeedbacks: stats.totalFeedbacks,
            positiveCount: stats.positiveCount,
            negativeCount: stats.negativeCount,
            negativePercentage,
        },
        sentimentBreakdown: {
            POS: stats.positiveCount,
            NEG: stats.negativeCount,
            NEU: stats.neutralCount,
        },
        feedbackBySource: channels,
        volumeOverTime: volumeOverTime,
        topThemes: topThemesResult, // Powered by AI Theme Clustering!
    };
};

export const getThemeTrendsService = async (workspaceId, days = 7) => {
    const now = new Date();
    const currentPeriodStart = new Date(now);
    currentPeriodStart.setDate(currentPeriodStart.getDate() - days);
    
    const previousPeriodStart = new Date(currentPeriodStart);
    previousPeriodStart.setDate(previousPeriodStart.getDate() - days);

    const pipeline = [
        // 1. Match feedbacks in the last (2 * days)
        {
            $match: {
                workspaceId: new mongoose.Types.ObjectId(workspaceId),
                createdAt: { $gte: previousPeriodStart }
            }
        },
        // 2. Unwind themes
        { $unwind: "$themes" },
        // 3. Group by theme and calculate current vs previous count
        {
            $group: {
                _id: "$themes",
                currentCount: {
                    $sum: { $cond: [{ $gte: ["$createdAt", currentPeriodStart] }, 1, 0] }
                },
                previousCount: {
                    $sum: { $cond: [{ $lt: ["$createdAt", currentPeriodStart] }, 1, 0] }
                }
            }
        },
        // 4. Lookup theme name
        {
            $lookup: {
                from: "themes",
                localField: "_id",
                foreignField: "_id",
                as: "themeDetails"
            }
        },
        { $unwind: "$themeDetails" },
        // 5. Project and calculate percentage change
        {
            $project: {
                _id: 0,
                name: "$themeDetails.name",
                currentCount: 1,
                previousCount: 1,
                percentageChange: {
                    $cond: [
                        { $eq: ["$previousCount", 0] },
                        { $cond: [{ $gt: ["$currentCount", 0] }, 100, 0] },
                        {
                            $multiply: [
                                { $divide: [{ $subtract: ["$currentCount", "$previousCount"] }, "$previousCount"] },
                                100
                            ]
                        }
                    ]
                }
            }
        },
        // 6. Determine if it's a spike (e.g., >= 50% increase AND at least 2 occurrences)
        {
            $addFields: {
                isSpike: {
                    $and: [
                        { $gte: ["$percentageChange", 50] },
                        { $gte: ["$currentCount", 2] }
                    ]
                }
            }
        },
        // 7. Sort by percentageChange descending
        { $sort: { percentageChange: -1, currentCount: -1 } }
    ];

    const trends = await Feedback.aggregate(pipeline);
    return trends;
};

export const askLoopRAGService = async (workspaceId, question) => {
    if (!question) {
        throw new Error("Question is required");
    }

    // 1. Retrieve Context: Get the latest 50 feedbacks for this workspace (to fit in 8k context window safely)
    const feedbacks = await Feedback.find({ workspaceId })
        .sort({ createdAt: -1 })
        .limit(50)
        .populate("themes", "name") // populate themes to get actual names
        .lean();

    if (feedbacks.length === 0) {
        return "You don't have any feedback data yet. Please upload some feedback first.";
    }

    // 2. Augment: Format the feedbacks into a clean text string for the AI
    const contextLines = feedbacks.map(fb => {
        const themeNames = fb.themes ? fb.themes.map(t => t.name).join(", ") : "None";
        return `[Date: ${fb.createdAt.toISOString().split('T')[0]}] [Sentiment: ${fb.sentiment}] [Themes: ${themeNames}] Text: "${fb.content}"`;
    });
    
    let contextData = contextLines.join("\n");
    if (contextData.length > 15000) {
        contextData = contextData.substring(0, 15000) + "\n...[Context Truncated due to size limit]";
    }

    // 3. Generate: Call the AI with the question and the context
    const answer = await askLoopQuestion(question, contextData);
    
    return answer;
};
