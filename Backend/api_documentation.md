# LOOP Backend API Documentation

This document contains all the endpoints available in the LOOP backend. Frontend developers can use this guide to integrate the APIs.

**Base URL:** `http://localhost:3000/api` (Update this once deployed to production)

> [!IMPORTANT]
> **Authentication (Cookies)**
> Most APIs require authentication. When a user logs in, the backend sends a JWT token as an `HTTPOnly Cookie`. The frontend does NOT need to store the token manually. Just ensure that all API requests from the frontend (Axios/Fetch) include `credentials: 'include'` so cookies are sent automatically.

---

## 1. Authentication (Auth)

### Register a new Workspace/User
- **Endpoint:** `POST /auth/register`
- **Body (JSON):**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword123"
  }
  ```

### Login
- **Endpoint:** `POST /auth/login`
- **Body (JSON):**
  ```json
  {
    "email": "john@example.com",
    "password": "securepassword123"
  }
  ```
- **Note:** Sets the `accessToken` and `refreshToken` cookies.

### Refresh Token
- **Endpoint:** `POST /auth/refresh`
- **Note:** Uses the HTTPOnly `refreshToken` cookie to generate a new `accessToken`.

### Logout
- **Endpoint:** `POST /auth/logout`
- **Note:** Clears the cookies.

---

## 2. Feedbacks

### Create a single Feedback (Auto-classified by AI)
- **Endpoint:** `POST /feedbacks`
- **Body (JSON):**
  ```json
  {
    "content": "The app keeps crashing when I upload a photo.",
    "channel": "WEB",
    "customerLabel": "Premium User"
  }
  ```

### Get all Feedbacks
- **Endpoint:** `GET /feedbacks`
- **Query Params (Optional):** `?status=NEW` or `?sentiment=NEG`

### Get a single Feedback by ID
- **Endpoint:** `GET /feedbacks/:id`

### Update Feedback Status or details
- **Endpoint:** `PUT /feedbacks/:id`
- **Body (JSON):**
  ```json
  {
    "status": "REVIEWED"
  }
  ```

### Delete a Feedback
- **Endpoint:** `DELETE /feedbacks/:id`

### Bulk Upload CSV
- **Endpoint:** `POST /feedbacks/upload`
- **Format:** `multipart/form-data`
- **Body:** Add a file field named `file` and select your `.csv` file.

### Reclassify a Feedback manually
- **Endpoint:** `POST /feedbacks/:id/reclassify`
- **Body:** None required.
- **Note:** Forces the AI to re-read the feedback and update its sentiment and themes.

### Backfill (Process unclassified CSV feedbacks via AI)
- **Endpoint:** `POST /feedbacks/backfill`
- **Body:** None required.
- **Note:** This will find all feedbacks with `sentiment: "NEU"` and run them through Llama-3 to generate themes.

---

## 3. Analytics & AI Dashboard

### Get Dashboard Stats (Charts & Top Themes)
- **Endpoint:** `GET /analytics/dashboard`
- **Response:** Returns `statCards`, `sentimentBreakdown`, `feedbackBySource`, `volumeOverTime`, and `topThemes`.

### Get Theme Trends & Spikes
- **Endpoint:** `GET /analytics/trends`
- **Query Params (Optional):** `?days=7` (Defaults to 7)
- **Response:** Returns an array of themes with `currentCount`, `previousCount`, `percentageChange`, and a boolean `isSpike`.

### Ask LOOP (RAG Chatbot)
- **Endpoint:** `POST /analytics/ask`
- **Body (JSON):**
  ```json
  {
    "question": "What are the most common complaints about the photo upload feature?"
  }
  ```
- **Response:** Returns `{ "answer": "Markdown formatted AI response..." }`

---

## 4. Voice of Customer (VoC) Reports

### Generate a new VoC Report
- **Endpoint:** `POST /reports/generate`
- **Body (JSON):**
  ```json
  {
    "days": 7
  }
  ```
- **Note:** Pre-computes stats for the last 7 days and generates an AI narrative summary. Saves the report in the database.

### Get all saved Reports
- **Endpoint:** `GET /reports`
- **Response:** Returns an array of saved reports for the workspace.

### Get a specific Report
- **Endpoint:** `GET /reports/:id`
- **Response:** Returns the full report object including the AI `narrative`.
