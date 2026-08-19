import mongoose from "mongoose";

const embeddingSchema = new mongoose.Schema(
    {
        feedbackId: {type: mongoose.Schema.Types.ObjectId, ref: "Feedback", required: true, unique: true},
        vector: {type: [Number], required: true}, 
    },
    {timestamps: true}
);

const Embedding = mongoose.model("Embedding", embeddingSchema);

export default Embedding;
