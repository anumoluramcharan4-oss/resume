# Product Requirement Document (PRD): CareerAI

## 1. Document Control
- **Product Name**: CareerAI
- **Description**: AI-Powered Career Growth & Resume Optimization Platform
- **Target Release**: v1.0.0
- **Status**: Approved

---

## 2. Product Vision & Goals

CareerAI is a premium, AI-driven career advisor, resume builder, ATS optimizer, and chatbot coaching platform. Its goal is to empower job seekers by providing instant, context-aware analysis of their resumes, comparing their profiles directly to target job descriptions, and delivering personalized career advice through a chat advisor.

### Key Objectives:
- **Accuracy**: Extract and structure raw resume text to minimize parsing errors.
- **Actionability**: Deliver deep, non-generic feedback for resume optimization.
- **Engagement**: Offer an interactive, responsive experience with zero placeholders.
- **Robustness**: Implement fallbacks to maintain AI reliability even during upstream API outages.

---

## 3. Key Features & Functional Specifications

### 3.1 User Authentication & Profile Management
- **Description**: Secure registration, login, and token-based session management.
- **Requirements**:
  - Encrypted password storage.
  - JWT-based authorization for all API requests.
  - Automatic session redirection for unauthenticated visitors.

### 3.2 Premium User Dashboard
- **Description**: A central landing page displaying a visual snapshot of the candidate's career metrics.
- **Requirements**:
  - Greeting banner personalized with the user's name.
  - Quick action buttons (Import Resume, Open Career Advisor, Match Job).
  - Visual summary cards showing target job title, ATS score indicators, and primary resume status.

### 3.3 Resume Hub & Version Control
- **Description**: Management portal for user resumes, supporting draft tracking and snapshot rollback.
- **Requirements**:
  - Ability to create, read, update, and delete resumes.
  - Primary resume selector: A toggle to designate which resume is used as the default for AI-advisor interactions.
  - Version Snapshotting: Saving a historic copy of the resume fields and raw text whenever major saves or imports occur.
  - Rollback capability: Restore previous snapshots to replace the active resume profile.

### 3.4 AI Resume PDF Parser & Importer
- **Description**: Upload a PDF resume to populate the user's structured profile fields.
- **Requirements**:
  - Support drag-and-drop or file selection (restricted to PDF files under 10MB).
  - Extract the plain, unformatted raw text (`rawText`) from the PDF using text extraction utilities.
  - Submit the raw text to the LLM to structure it into a pre-defined JSON format containing Personal Details, Professional Summary, Skills, Work Experience, Projects, and Education.
  - Provide a preview step where users can edit parsed fields before saving.
  - Save the extracted `rawText` directly alongside the structured fields in the database.

### 3.5 ATS Scan & Job Match Analyzer
- **Description**: Align the candidate's resume with a specified job description to calculate a match score and list recommendations.
- **Requirements**:
  - Form field to paste target job description.
  - Select which resume to match.
  - **AI Prompt Integration**: Combine the resume's `rawText` (falling back to JSON stringified structured data) and the job description.
  - Deliver structured analysis in the following schema:
    - **Match Percentage**: Overall percentage compatibility (0-100).
    - **Fit Summary**: Text description of the candidate's alignment.
    - **Strengths**: Match points (e.g. matching keywords, experience).
    - **Gaps**: Missing technologies or qualifications.
    - **ATS Suggestions**: Steps to format or rewrite points to bypass ATS filters.

### 3.6 Coach Gemini Career Advisor Chatbot
- **Description**: Chat assistant providing interview prep, career transitions, and professional skill enhancement.
- **Requirements**:
  - Continuous chat thread showing conversation history.
  - Contextual awareness: Automatically query and append the user's active resume `rawText` (or structured resume JSON) directly to the prompt context.
  - Custom chatbot persona: A supportive yet direct senior hiring manager.
  - Ability to answer questions referencing specific bullet points or projects in the candidate's resume.

---

## 4. Technical Stack & Architecture

### 4.1 System Architecture
```text
[React Client] (Vite, Axios, Framer Motion)
      │
      ▼  (HTTP REST, JSON)
[Express Server] (Node.js, JWT, pdf-parse)
      │
      ├───────► [MongoDB] (Mongoose ODM)
      │
      └───────► [OpenRouter AI Gateways] (Gemini, Qwen, Llama fallbacks)
```

### 4.2 Database Schema Specification

#### A. Resume Schema
- `user` (Object ID, ref: User, required)
- `title` (String, required)
- `template` (String: "modern" | "minimal" | "professional" | "ats-friendly")
- `rawText` (String, default: null) - Holds the plain extracted text
- `personal` (Sub-document: fullName, email, phone, location, linkedin, github, website)
- `about` (String) - Professional summary
- `skills` (Array of objects: name, level)
- `experience` (Array of objects: company, role, location, startDate, endDate, description)
- `projects` (Array of objects: name, description, technologies, githubUrl, demoUrl)
- `education` (Array of objects: school, degree, fieldOfStudy, startDate, endDate, grade, description)
- `isPrimary` (Boolean) - Default fallback indicator

#### B. ResumeVersion Schema
- `resume` (Object ID, ref: Resume, required)
- `versionNumber` (Number, required)
- `title` (String, required)
- `template` (String)
- `rawText` (String) - Raw text snapshot
- `personal` (Object)
- `about` (String)
- `skills` (Array)
- `experience` (Array)
- `projects` (Array)
- `education` (Array)

---

## 5. Non-Functional & Quality Requirements

### 5.1 AI Reliability & Fallbacks
- The system must query an unified AI client using a prioritized queue of free/low-cost model IDs:
  1. `google/gemini-2.5-flash:free` (Primary default)
  2. `openrouter/free` (Automatic optimal free route)
  3. `qwen/qwen-2.5-coder-32b-instruct:free` (Coding/structuring fallback)
  4. `meta-llama/llama-3.3-70b-instruct:free` (General logic fallback)
- **Timeout Management**: A 25-second API timeout per model request. If a model fails to reply within 25 seconds, the request aborts and tries the next model in the fallback queue.

### 5.2 Performance & Limits
- PDF file size must be capped at 10MB.
- Text extraction must perform parsing synchronously during request handling, returning clean output in under 5 seconds.
- AI structuring operations must return structured data within 30 seconds.

### 5.3 UX & Visual Design ("Luxe CSS")
- Elegant dark mode with rich glassmorphism (translucent blur filters over surface backgrounds).
- Subtle typography, vibrant gradient indicators (e.g. from purple-accent to amber-orange for progress meters), and micro-animations for hover states and transitions.
- Interactive sidebars, dashboard layout grids, and clear visual response alerts.
