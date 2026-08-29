import {
    createFeedbackService,
    getFeedbacksService,
    getFeedbackByIdService,
    updateFeedbackService,
    deleteFeedbackService,
    bulkUploadFeedbackService,
    reclassifyFeedbackService,
    backfillClassificationsService,
} from "../services/feedback.service.mjs";

export const createFeedback = async (req, res) => {
    try {
      
        const workspaceId = req.user.workspaceId;
        const feedback = await createFeedbackService(workspaceId, req.body);
        
        res.status(201).json({message: "Feedback created successfully", feedback});
    } catch (error) {
        res.status(error.statusCode || 500).json({message: error.message});
    }
};

export const getFeedbacks = async (req, res) => {
    try {
        const workspaceId = req.user.workspaceId;
        const result = await getFeedbacksService(workspaceId, req.query);
        
        res.status(200).json(result);
    } catch (error) {
        res.status(error.statusCode || 500).json({message: error.message});
    }
};

export const getFeedbackById = async (req, res) => {
    try {
        const workspaceId = req.user.workspaceId;
        const {id} = req.params;
        const feedback = await getFeedbackByIdService(workspaceId, id);
        
        res.status(200).json({feedback});
    } catch (error) {
        res.status(error.statusCode || 500).json({message: error.message});
    }
};

export const updateFeedback = async (req, res) => {
    try {
        const workspaceId = req.user.workspaceId;
        const {id} = req.params;
        const feedback = await updateFeedbackService(workspaceId, id, req.body);
        
        res.status(200).json({message: "Feedback updated successfully", feedback});
    } catch (error) {
        res.status(error.statusCode || 500).json({message: error.message});
    }
};

export const deleteFeedback = async (req, res) => {
    try {
        const workspaceId = req.user.workspaceId;
        const {id} = req.params;
        await deleteFeedbackService(workspaceId, id);
        
        res.status(200).json({message: "Feedback deleted successfully"});
    } catch (error) {
        res.status(error.statusCode || 500).json({message: error.message});
    }
};

export const uploadFeedbacks = async (req, res) => {
    try {
        const workspaceId = req.user.workspaceId;
        
        if (!req.file || !req.file.buffer) {
            return res.status(400).json({message: "No CSV file uploaded"});
        }

        const result = await bulkUploadFeedbackService(workspaceId, req.file.buffer);
        
        res.status(200).json(result);
    } catch (error) {
        res.status(error.statusCode || 500).json({message: error.message});
    }
};

export const reclassifyFeedback = async (req, res) => {
    try {
        const workspaceId = req.user.workspaceId;
        const { id } = req.params;
        const feedback = await reclassifyFeedbackService(workspaceId, id);
        
        res.status(200).json({ message: "Feedback reclassified successfully", feedback });
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

export const backfillClassifications = async (req, res) => {
    try {
        const workspaceId = req.user.workspaceId;
        const result = await backfillClassificationsService(workspaceId);
        
        res.status(200).json(result);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};
