import mongoose from "mongoose";

import Workspace from "../models/workspace.model.mjs";
import User from "../models/user.model.mjs";
import Feedback from "../models/feedback.model.mjs";
import Theme from "../models/theme.model.mjs";
import bcrypt from "bcrypt";
import {config} from "../config/config.mjs"


const mongoURI = config.mongoURI || process.env.DATABASE_URL;

const seedDatabase = async () => {
    try {
        if (!mongoURI) {
            console.error("❌ Error: MONGO_URI is missing in .env file.");
            process.exit(1);
        }

        console.log("⏳ Connecting to MongoDB...");
        await mongoose.connect(mongoURI);
        console.log("✅ MongoDB Connected!");

        console.log("🧹 Clearing old data...");
        await Workspace.deleteMany({});
        await User.deleteMany({});
        await Feedback.deleteMany({});
        await Theme.deleteMany({});

        console.log("🏢 Creating Demo Workspace...");
        const workspace = await Workspace.create({
            name: "Acme Corp (Demo)",
        });

        console.log("👥 Creating Users (Admin, Analyst, Viewer)...");
        const passwordHash = await bcrypt.hash("password123", 10);
        
        await User.create([
            {
                workspaceId: workspace._id,
                name: "Alice Admin",
                email: "admin@acmecorp.com",
                passwordHash,
                role: "ADMIN"
            },
            {
                workspaceId: workspace._id,
                name: "Bob Analyst",
                email: "analyst@acmecorp.com",
                passwordHash,
                role: "ANALYST"
            },
            {
                workspaceId: workspace._id,
                name: "Charlie Viewer",
                email: "viewer@acmecorp.com",
                passwordHash,
                role: "VIEWER"
            }
        ]);

        console.log("🏷️ Creating Themes...");
        const themes = await Theme.create([
            { workspaceId: workspace._id, name: "Pricing", description: "Feedback about costs", color: "#FF5733" },
            { workspaceId: workspace._id, name: "Bugs", description: "App crashes and errors", color: "#C70039" },
            { workspaceId: workspace._id, name: "UX", description: "User experience & design", color: "#33FF57" }
        ]);

        console.log("📝 Creating Feedbacks...");
        await Feedback.create([
            {
                workspaceId: workspace._id,
                content: "The new dashboard is too confusing to navigate.",
                channel: "Support Ticket",
                sentiment: "NEG",
                sentimentScore: -0.8,
                status: "NEW",
                themes: [themes[2]._id] // UX
            },
            {
                workspaceId: workspace._id,
                content: "I love the new dark mode! It looks amazing.",
                channel: "App Store",
                sentiment: "POS",
                sentimentScore: 0.9,
                status: "REVIEWED",
                themes: [themes[2]._id] // UX
            },
            {
                workspaceId: workspace._id,
                content: "App crashes every time I try to download the invoice.",
                channel: "Email",
                sentiment: "NEG",
                sentimentScore: -0.9,
                status: "ACTIONED",
                themes: [themes[1]._id] // Bugs
            },
            {
                workspaceId: workspace._id,
                content: "Is there a student discount available?",
                channel: "Live Chat",
                sentiment: "NEU",
                sentimentScore: 0,
                status: "NEW",
                themes: [themes[0]._id] // Pricing
            }
        ]);

        console.log("🎉 Seed complete! Database is ready to use.");
        process.exit(0);
    } catch (error) {
        console.error("❌ Seeding Error:", error);
        process.exit(1);
    }
};

seedDatabase();
