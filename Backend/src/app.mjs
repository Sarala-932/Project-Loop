import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.routes.mjs";
import feedbackRoutes from "./routes/feedback.routes.mjs";
import analyticsRoutes from "./routes/analytics.routes.mjs";
import reportRoutes from "./routes/report.routes.mjs";
import teamRoutes from "./routes/team.routes.mjs";
import widgetRoutes from "./routes/widget.routes.mjs";

const app = express();

app.use(express.json());
app.use(cookieParser());
// Allow dynamic CORS so dashboard cookies work, but external websites can use widget
app.use(cors({
    origin: [
        "http://localhost:5173", 
        "https://project-loop-one-iota.vercel.app"
    ],
    credentials: true
}));
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/feedbacks", feedbackRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/widget", widgetRoutes);

app.get("/", (_req, res) => {
    res.status(200).json({message: "Server is running..."});
});

export default app;
