import Groq from "groq-sdk";
import {z} from "zod";

const groq = new Groq({apiKey: process.env.GROQ_API_KEY});

export const ClassificationSchema = z.object({
    sentiment: z.enum(["POS", "NEG", "NEU"]),
    sentimentScore: z.number().min(-1).max(1),
    themes: z.array(z.string()),
    featureArea: z.string(),
    rationale: z.string(),
});

export const classifyFeedbackText = async (text) => {
    if (!process.env.GROQ_API_KEY) {
        console.warn("GROQ_API_KEY is not set. Skipping AI classification and using NEUTRAL fallback.");
        return {
            sentiment: "NEU",
            sentimentScore: 0,
            themes: [],
            featureArea: "General",
            rationale: "API key missing",
        };
    }

    const systemPrompt = `You are an AI assistant for a Customer Feedback Intelligence Platform.
Your ONLY job is to analyze customer feedback and output a strict JSON object.
Do NOT wrap the output in markdown code blocks like \`\`\`json. Output ONLY the raw JSON string.

The JSON MUST perfectly match this structure:
{
  "sentiment": "Must be exactly 'POS', 'NEG', or 'NEU'",
  "sentimentScore": "A number from -1.0 (most negative) to 1.0 (most positive), neutral is 0",
  "themes": "Array of 1 to 3 string tags summarizing the topics",
  "featureArea": "A short 1-2 word string representing the product area (e.g. 'Authentication', 'Dashboard', 'Mobile App')",
  "rationale": "One short sentence explaining your choice"
}`;

    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {role: "system", content: systemPrompt},
                {role: "user", content: text},
            ],
            model: "openai/gpt-oss-20b",
            temperature: 0,
            response_format: {type: "json_object"},
        });

        const content = chatCompletion.choices[0]?.message?.content;
        if (!content) throw new Error("No content received from AI");

        const rawJson = JSON.parse(content);
        const validatedData = ClassificationSchema.parse(rawJson);

        return validatedData;
    } catch (error) {
        console.error("AI Classification Failed:", error.message || error);

        return {
            sentiment: "NEU",
            sentimentScore: 0,
            themes: ["Unclassified"],
            featureArea: "General",
            rationale: "AI processing failed",
        };
    }
};

export const askLoopQuestion = async (question, feedbacksContext) => {
    if (!process.env.GROQ_API_KEY) {
        return "I'm sorry, my AI brain is currently disconnected (API key missing). Please connect my Groq API key to ask questions.";
    }

    const systemPrompt = `You are "LOOP AI", a highly intelligent Product Manager Assistant for a Customer Feedback Platform.
The user will ask you a question about their customers or product.
I will provide you with a list of recent customer feedbacks as "Context".

CRITICAL RULES:
1. ONLY use the provided Context to answer the question. Do NOT hallucinate or make up features that are not mentioned in the context.
2. If the context does not contain enough information to answer the question, clearly state: "I cannot answer this based on the current feedback data."
3. Be concise, professional, and insightful. Highlight specific themes if relevant.
4. Format your answer in Markdown for readability, but DO NOT USE TABLES. Use bullet points or numbered lists instead of tables.`;

    const userMessage = `--- CONTEXT (Recent Feedbacks) ---
${feedbacksContext}
----------------------------------

QUESTION: ${question}`;

    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {role: "system", content: systemPrompt},
                {role: "user", content: userMessage},
            ],
            model: "openai/gpt-oss-20b",
            temperature: 0.2,
        });

        return chatCompletion.choices[0]?.message?.content || "No response generated.";
    } catch (error) {
        console.error("Ask LOOP AI Failed:", error.message || error);
        return `Groq API Error: ${error.message}`;
    }
};

export const generateVoCNarrative = async (statsData) => {
    if (!process.env.GROQ_API_KEY) {
        return "VoC Narrative generation requires a valid Groq API key.";
    }

    const systemPrompt = `You are an expert Product Marketing Manager and Data Analyst.
Your task is to write a "Voice of Customer (VoC)" executive summary based on the provided statistics.

CRITICAL RULES:
1. Write a professional, engaging narrative summarizing the overall health of the product based on the numbers.
2. Structure the report with clear headings (e.g., Executive Summary, Key Highlights, Areas of Concern).
3. Do not invent numbers; strictly use the statistics provided.
4. Format the output in Markdown. Be concise but insightful.`;

    const userMessage = `Here are the statistics for the recent period:
${JSON.stringify(statsData, null, 2)}

Please generate the Voice of Customer narrative report.`;

    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {role: "system", content: systemPrompt},
                {role: "user", content: userMessage},
            ],
            model: "openai/gpt-oss-20b",
            temperature: 0.3,
        });

        return chatCompletion.choices[0]?.message?.content || "No narrative generated.";
    } catch (error) {
        console.error("VoC Narrative Generation Failed:", error.message || error);
        return "Error generating narrative.";
    }
};
