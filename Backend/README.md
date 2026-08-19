# LOOP Backend 🚀

This is the backend API for **LOOP** - an AI-powered Customer Feedback Intelligence Platform. 
Built with Node.js, Express, MongoDB, and GPT OSS 20B (Groq). 

*This project was developed over a 4-Week Internship Bootcamp.*

---

## 📅 Project Timeline & Features

### Week 1: Foundation & Authentication
- **Project Setup:** Node.js, Express, and MongoDB connection.
- **MVC Architecture:** Structured code into Models, Views (Controllers), and Routes.
- **Secure Authentication:** 
  - User Registration & Login with Bcrypt password hashing.
  - JWT Authentication using HTTP-Only Cookies for maximum security.
  - Implemented Refresh Tokens and Role-Based Access Control (Admin vs Viewer).

### Week 2: Core Feedback Engine
- **Feedback Management:** CRUD operations for customer feedback.
- **Mongoose Schemas:** Complex data modeling for Workspaces, Users, and Feedback.
- **Bulk Data Ingestion:** Developed a robust CSV Bulk Upload feature using `multer` and `csv-parser` to handle thousands of historical feedbacks.

### Week 3: AI Integration (The "Brain")
- **Groq & GPT OSS 20B:** Integrated the blazing-fast Groq LPU to power AI features.
- **Auto-Classification:** Automatically determines Sentiment (POS/NEG/NEU) and extracts Feature Areas on every new feedback.
- **Theme Clustering:** AI automatically generates common "Themes" across hundreds of complaints to find patterns.
- **"Ask LOOP" (RAG Chatbot):** A Retrieval-Augmented Generation chatbot that allows Product Managers to ask questions directly about their feedback database in natural language.

### Week 4: Analytics & Polish
- **Analytics Dashboard:** Aggregation pipelines for Sentiment Breakdown, Volume Over Time, and Feedback by Source.
- **Spike Detection:** Calculates percentage changes over 7-day periods to alert managers about sudden "Spikes" in bugs or crashes.
- **Voice-of-Customer (VoC) Reports:** Pre-computes complex data statistics and uses AI to write a professional Executive Summary narrative, which is saved to the database.

---

## 🛠️ Tech Stack
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose ODM)
- **AI/LLM:** GPT OSS 20B (via Groq API SDK)
- **Security:** JWT (JSON Web Tokens), Bcrypt, HTTP-Only Cookies, CORS
- **Utilities:** Zod (Schema Validation), Multer (File Uploads)

---

## ⚙️ Environment Variables (.env)
To run this project locally, create a `.env` file in the root directory:

```env
PORT=3000
CLIENT_URL=http://localhost:5173
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
JWT_REFRESH_SECRET=your_super_secret_refresh_key
GROQ_API_KEY=your_groq_api_key
```

## 🚀 Running Locally

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```
   *or*
   ```bash
   npm start
   ```

## 🌐 Deployment (Render)

This backend is fully configured for deployment on [Render](https://render.com/).

1. Create a new **Web Service** on Render.
2. Connect your GitHub repository.
3. **Build Command:** `npm install`
4. **Start Command:** `npm start`
5. Under **Environment Variables**, add all the variables from your `.env` file. (Make sure to set `CLIENT_URL` to your live frontend URL).
