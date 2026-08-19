# Project LOOP 🔄

LOOP is a multi-tenant AI feedback-intelligence platform that turns scattered customer feedback into a ranked, evidence-backed list of what to build next. 

## Project Summary
Companies collect feedback everywhere—support tickets, app reviews, and sales calls. Nobody has time to read them all. LOOP swallows all of that text, uses AI to tag, sort, and summarize it, and provides a powerful dashboard for Product Managers to make data-driven decisions without relying on gut feelings.

## Tech Stack (Frontend)
- **Framework:** React + Vite
- **Styling:** Tailwind CSS (Custom Premium UI with Glassmorphism)
- **Icons:** Lucide React
- **State Management:** Zustand
- **Routing:** React Router

## Architecture Overview
LOOP uses a clean three-layer flow:
1. **Browser (React UI):** The frontend application. It never talks to the database or Claude API directly to maintain security.
2. **API Layer (Backend):** Checks authentication, enforces roles, and strictly scopes every request to the user's `workspaceId`.
3. **Database + Claude API:** Handles PostgreSQL reads/writes and AI feature generation with proper RAG (Retrieval-Augmented Generation) grounding.

## Demo Accounts (RBAC)
For graders and mentors to evaluate the platform, use the following seeded demo accounts. 

*Workspace:* **Demo Corp**

| Role | Email | Password | Permissions |
|------|-------|----------|-------------|
| **Admin** | `admin@demo.com` | `demo123` | Full access (manage members, assign roles, full data access) |
| **Analyst** | `analyst@demo.com` | `demo123` | Ingest and manage feedback, use AI features |
| **Viewer** | `viewer@demo.com` | `demo123` | Read-only access to dashboards and reports |

*(Note: These credentials map to the seeded database provided by the backend).*

## Local Setup Instructions

### Prerequisites
- Node.js 18+
- Git

### Installation
1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd LOOP-Frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Variables:**
   Create a `.env` file in the root directory (never commit this file). Example:
   ```env
   VITE_API_BASE_URL=http://localhost:8080/api
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Build for production:**
   ```bash
   npm run build
   ```

## Key Features Developed
- **Complete Tenant Isolation:** Secure multi-tenant architecture.
- **Feedback Ingestion:** Manual entry, simulated channel sync, and Bulk CSV Upload.
- **AI Auto-classification:** Every new feedback is automatically tagged with sentiment, themes, and priority.
- **Ask LOOP (Grounded Q&A):** A conversational AI that answers questions based *only* on real customer data.
- **Responsive Premium Dashboard:** Fully responsive Analytics dashboard with working Light/Dark modes.
