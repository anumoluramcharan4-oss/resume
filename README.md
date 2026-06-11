# CareerAI — AI-Powered Career Growth Platform

CareerAI is a premium, full-stack career acceleration platform designed to help candidates optimize their professional profiles, audit their ATS compatibilities, and get personalized, AI-driven guidance to unlock their dream roles.

---

## 🚀 Key Features

### 1. Smart Career Advisor (Premium Feature)
- **Onboarding Setup Wizard**: Auto-detects details from existing resumes to configure profile parameters (skills, interests, location, target salary, work types).
- **Match Analysis**: Delivers match percentages and targeted growth timeline forecasts for recommended career tracks (e.g. Frontend Developer, AI Engineer).
- **Skill Gap Analyzer**: Compares current skills against industry requirements, calculating match ratings and prioritizing missing skills.
- **Interactive Roadmap Timeline**: Phase-by-phase stepped timeline with progress indicators and curations.
- **Credential & Project Recommender**: Recommends resume-boosting projects and certifications, dynamically recalculating readiness metrics as checkboxes are toggled.
- **Coach Gemini Chatbot**: In-app AI Career Coach that retains chat histories and responds with context-aware advice.

### 2. Resume Builder & Template Gallery
- **Luxe Templates**: Includes *Modern*, *Minimal*, and *Professional* template outputs.
- **Real-Time Editor**: Add, modify, and preview personal profiles, experience, projects, and languages on the fly.
- **AI Text Improver**: Rephrase and rewrite bullet points into concise, action-oriented, ATS-optimized text.

### 3. Job Match Analyzer
- **ATS Compatibility Audits**: Paste job descriptions to receive compatibility scores, breakdown analysis, missing keywords, and recruiter optimization tips.

---

## 🛠️ Technology Stack

### Frontend
- **React 19** & **Vite 8**
- **Tailwind CSS v4** (Utility-first framework with a custom Dark Editorial Luxe design system)
- **Framer Motion 12** (Smooth, luxury-style page reveals and micro-interactions)
- **Recharts 3** (Interactive charts for salary analysis and ATS progress tracking)
- **Lucide React** (Vector icons)

### Backend
- **Node.js** & **Express**
- **MongoDB** & **Mongoose** (Database modeling and transaction logs)
- **Google Gemini API** (`@google/generative-ai`) for powering all matching, suggestions, and chat actions.
- **JWT (JSON Web Tokens)** for secure, session-persistent route authentication.

---

## 🔑 Security & Environment Configurations

To ensure API keys and database credentials are kept private and secure, all secrets are loaded via environment variables and are excluded from Git.

### Setup Environment Files
Create a `.env` file inside the `backend` directory.

> [!WARNING]
> Never commit `.env` or hardcode your Gemini API Key into source control. The root `.gitignore` is pre-configured to ignore all `*.env` files.

#### `backend/.env` Configuration Template:
```env
# Server port
PORT=5001

# MongoDB Connection String (Local or MongoDB Atlas)
MONGO_URI=mongodb://localhost:27017/careergrowth

# JWT Secret Token for authentication
JWT_SECRET=your_super_secret_jwt_key

# JWT Token Expiration Period
JWT_EXPIRE=7d

# Google Gemini API Key (Generate at https://aistudio.google.com/app/apikey)
GEMINI_API_KEY=AIzaSyYourGeminiAPIKeyHere

# Frontend URL (for CORS allowance)
CLIENT_URL=http://localhost:5173
```

---

## 🏁 Getting Started

### Prerequisites
- **Node.js** (v18 or higher recommended)
- **MongoDB** (Ensure a local instance is running, or get an Atlas URI)

### Step-by-Step Installation

#### 1. Setup Backend Server
```bash
# Navigate to the backend folder
cd backend

# Install server dependencies
npm install

# Start the backend development server
npm run dev
```

#### 2. Setup Frontend Client
```bash
# Open a new terminal and navigate to the frontend folder
cd frontend

# Install client dependencies
npm install

# Start the frontend dev server
npm run dev
```

The application will now be running on:
- Frontend: [http://localhost:5173](http://localhost:5173) (Proxies `/api` requests to backend on port 5001)
- Backend API: [http://localhost:5001](http://localhost:5001)

---

## 📡 API Reference Directory

### Authentication (`/api/auth`)
- `POST /register` - Register a new account.
- `POST /login` - Login to an existing session.
- `GET /me` - Retrieve current session context.
- `PUT /profile` - Update basic user parameters.

### Career Advisor (`/api/advisor`)
- `GET /profile` - Retrieve advisor settings, roadmap checklist, and chat history.
- `POST /initialize` - Analyze skills and initialize recommendations.
- `POST /toggle-skill` - Mark a roadmap skill as completed/pending.
- `POST /toggle-project` - Toggle completion of recommended projects.
- `POST /toggle-certification` - Toggle completion of recommended certifications.
- `POST /chat` - Chat with Coach Gemini.

### Resumes (`/api/resumes`)
- `GET /` - List all resumes.
- `POST /` - Create a new resume template.
- `GET /:id` - Get resume details.
- `PUT /:id` - Update resume sections.
- `DELETE /:id` - Remove resume.

### AI Assist (`/api/ai`)
- `POST /improve-text` - Professional bullet-point enhancer.
- `POST /generate-summary` - Write resume summaries.
- `POST /ats-score` - Scan resume context for ATS alignment.
- `POST /match-job` - Audit compatibility scores.
