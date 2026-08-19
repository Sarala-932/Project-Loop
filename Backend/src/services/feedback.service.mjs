import Feedback from "../models/feedback.model.mjs";
import createError from "../utils/createError.mjs";
import csv from "csv-parser";
import { Readable } from "stream";
import { classifyFeedbackText } from "./ai.service.mjs";
import Theme from "../models/theme.model.mjs";

const linkThemes = async (workspaceId, themeNames) => {
    if (!themeNames || themeNames.length === 0) return [];
    const themeIds = [];
    for (const name of themeNames) {
        // Upsert: Find the theme or create it if it doesn't exist
        const theme = await Theme.findOneAndUpdate(
            { workspaceId, name },
            { $setOnInsert: { workspaceId, name } },
            { upsert: true, new: true }
        );
        themeIds.push(theme._id);
    }
    return themeIds;
};

export const createFeedbackService = async (workspaceId, data) => {
    if (!data.text) {
        throw createError("Feedback text is required", 400);
    }

    // Check for exact duplicate feedback in the same workspace
    const existingFeedback = await Feedback.findOne({ workspaceId, content: data.text });
    if (existingFeedback) {
        throw createError("This exact feedback already exists in your workspace", 409); // 409 Conflict
    }

    // Call Groq AI to classify the text
    const aiClassification = await classifyFeedbackText(data.text);

    // Auto-link themes to the Database
    const themeIds = await linkThemes(workspaceId, aiClassification.themes);

    // Creating feedback linked specifically to the user's workspace
    const feedback = await Feedback.create({
        workspaceId,
        content: data.text,
        channel: data.channel || "MANUAL",
        sentiment: aiClassification.sentiment,
        sentimentScore: aiClassification.sentimentScore,
        themes: themeIds, // Saving ObjectIds
        status: data.status || "NEW",
    });

    // Attach the full AI reasoning to the response for the frontend to see
    return { ...feedback.toObject(), ai_rationale: aiClassification.rationale, ai_themes: aiClassification.themes };
};

export const getFeedbacksService = async (workspaceId, query) => {
    const {page = 1, limit = 10, status, channel, sentiment, search, startDate, endDate} = query;

    // MANDATORY TENANT ISOLATION: Every query must filter by workspaceId
    const filter = {workspaceId};

    if (status) filter.status = status;
    if (channel) filter.channel = channel;
    if (sentiment) filter.sentiment = sentiment;

    // Date Range Filter
    if (startDate || endDate) {
        filter.createdAt = {};
        if (startDate) filter.createdAt.$gte = new Date(startDate);
        if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    // Full-Text Search
    if (search) {
        filter.content = {$regex: search, $options: "i"}; // Case-insensitive regex search
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const feedbacks = await Feedback.find(filter)
        .sort({createdAt: -1})
        .skip(skip)
        .limit(parseInt(limit))
        .populate("themes", "name");

    const total = await Feedback.countDocuments(filter);

    return {
        feedbacks,
        pagination: {
            total,
            page: parseInt(page),
            pages: Math.ceil(total / parseInt(limit)),
        },
    };
};

export const getFeedbackByIdService = async (workspaceId, feedbackId) => {
    // Tenant isolation: Ensure feedback belongs to user's workspace
    const feedback = await Feedback.findOne({
        _id: feedbackId,
        workspaceId,
    });

    if (!feedback) {
        throw createError("Feedback not found or access denied", 404);
    }
    return feedback;
};

export const updateFeedbackService = async (workspaceId, feedbackId, updateData) => {
    // Tenant isolation: Ensure update only happens if it belongs to user's workspace
    const feedback = await Feedback.findOneAndUpdate({_id: feedbackId, workspaceId}, updateData, {
        new: true,
        runValidators: true,
    });

    if (!feedback) {
        throw createError("Feedback not found or access denied", 404);
    }
    return feedback;
};

export const deleteFeedbackService = async (workspaceId, feedbackId) => {
    // Tenant isolation: Ensure delete only happens if it belongs to user's workspace
    const feedback = await Feedback.findOneAndDelete({_id: feedbackId, workspaceId});
    if (!feedback) {
        throw createError("Feedback not found or access denied", 404);
    }
    return feedback;
};

export const bulkUploadFeedbackService = async (workspaceId, fileBuffer) => {
    return new Promise((resolve, reject) => {
        const results = [];
        let failureCount = 0;

        Readable.from(fileBuffer)
            .pipe(csv())
            .on("data", (data) => {
                const content = data.content || data.text;
                if (!content) {
                    failureCount++;
                    return; // Skip invalid row
                }

                results.push({
                    workspaceId,
                    content,
                    channel: data.channel || "MANUAL",
                    customerLabel: data.customerLabel || data.customer_label || "",
                    sentiment: data.sentiment || "NEU",
                    status: "NEW",
                });
            })
            .on("end", async () => {
                try {
                    let successCount = 0;
                    if (results.length > 0) {
                        // Use insertMany to efficiently save all documents
                        await Feedback.insertMany(results, { ordered: false });
                        successCount = results.length;
                        
                        // Automatically run AI analysis on the uploaded items
                        // (We do this asynchronously after sending the response to prevent long upload times for huge CSVs, 
                        // but since the frontend loader waits, we can await it here for immediate results)
                        await backfillClassificationsService(workspaceId);
                    }
                    resolve({
                        message: "CSV imported and analyzed successfully",
                        successCount,
                        failureCount,
                    });
                } catch (error) {
                    reject(createError("Database error during bulk insert", 500));
                }
            })
            .on("error", (error) => {
                reject(createError("Error parsing CSV file", 500));
            });
    });
};

export const reclassifyFeedbackService = async (workspaceId, feedbackId) => {
    const feedback = await Feedback.findOne({ _id: feedbackId, workspaceId });
    if (!feedback) {
        throw createError("Feedback not found or access denied", 404);
    }

    // Call Groq AI to classify again
    const aiClassification = await classifyFeedbackText(feedback.content);

    const themeIds = await linkThemes(workspaceId, aiClassification.themes);

    feedback.sentiment = aiClassification.sentiment;
    feedback.sentimentScore = aiClassification.sentimentScore;
    feedback.themes = themeIds;
    await feedback.save();

    return { ...feedback.toObject(), ai_rationale: aiClassification.rationale, ai_themes: aiClassification.themes };
};

export const backfillClassificationsService = async (workspaceId) => {
    // We only backfill those marked NEUTRAL to save API requests, limited to 50 at a time
    const feedbacksToClassify = await Feedback.find({ workspaceId, sentiment: "NEU" }).limit(50);
    
    let processed = 0;
    let failed = 0;

    for (const feedback of feedbacksToClassify) {
        try {
            const aiClassification = await classifyFeedbackText(feedback.content);
            const themeIds = await linkThemes(workspaceId, aiClassification.themes);

            feedback.sentiment = aiClassification.sentiment;
            feedback.sentimentScore = aiClassification.sentimentScore;
            feedback.themes = themeIds;
            await feedback.save();
            processed++;
        } catch (err) {
            failed++;
        }
    }

    return { 
        message: "Backfill completed for this batch", 
        processed, 
        failed
    };
};
