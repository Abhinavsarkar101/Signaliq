# SignalIQ ⚡

> **AI-Powered Customer Feedback Intelligence & Research Sufficiency Platform**  
> *Transform fragmented customer signals into high-conviction, evidence-backed product decisions.*

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0-61dafb.svg)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4.0-38bdf8.svg)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-4.x-lightgrey.svg)](https://expressjs.com/)
[![Gemini AI](https://img.shields.io/badge/Google%20Gemini-3.8--Flash-orange.svg)](https://deepmind.google/technologies/gemini/)

---

## 📌 Overview

**SignalIQ** is an enterprise-grade Customer Feedback Intelligence platform built for Founders, Product Managers, Customer Success Leads, and UX Researchers. 

Rather than treating user feedback as isolated quotes or generic sentiment graphs, SignalIQ introduces a **rigorous evidence-based workflow**:
1. **Dynamic Onboarding & Role Customization**: Customizes your dashboard, key telemetry, and recommended actions based on your exact role and business objectives.
2. **AI-Synthesized Research Briefs**: Derives core hypotheses, granular sub-questions, signal indicators, and known blindspots with interactive user validation and Gemini AI re-synthesis.
3. **Multi-Modal Evidence Ingestion**: Ingests support tickets (CSV/XLSX), qualitative customer interview transcripts, app reviews, and UI friction heatmaps with automated column mapping and data hygiene.
4. **Research Sufficiency Assessment (3-Tier Confidence)**: Determines whether existing qualitative & quantitative evidence is **Sufficient**, has a **Knowledge Gap**, or is **Insufficient** before taking action.
5. **Targeted Micro-Survey Engine**: Automatically drafts, distributes, and collects targeted surveys *only* when specific knowledge gaps exist, preventing survey fatigue.
6. **Executive Boardroom Reports & Action Roadmaps**: Generates boardroom-ready presentations, traceable user quote references, impact vs. effort priority matrices, and PDF exports.

---

## ✨ Key Features

### 🎯 1. Role-Adaptive Dashboard & Onboarding
- **Interactive Questionnaire**: Personalizes workspace KPIs and workflows for:
  - *Founder / Executive*: Strategic retention risk, churn telemetry, executive reports.
  - *Product Manager / Designer*: Roadmap validation, friction bottlenecks, feature prioritization.
  - *Customer Success & Support Lead*: CSAT trends, ticket clustering, proactive save triggers.
  - *User Researcher / Data Analyst*: Methodological rigor, data triangulation, gap analysis.
- **Focused vs. Full Platform View**: Switch between role-streamlined cards and complete platform explorers with a single toggle.
- **Pre-loaded Sample Scenarios**: Test immediately with built-in realistic scenarios:
  - *Scenario A (Sufficient)*: B2B SaaS onboarding drop-off tickets.
  - *Scenario B (Partially Sufficient / Gap)*: Mobile e-commerce checkout hesitation.
  - *Scenario C (Insufficient / Exploratory)*: Early-stage churn interviews.

---

### 🧠 2. AI Research Strategy & Objective Framing
- Formulates a complete **Research Architecture** from your business objective using Gemini AI:
  - **Primary Question & Core Hypothesis**.
  - **Granular Sub-Questions** guiding evidence synthesis.
  - **Identified Blindspots & Limitations** with quick-decision mitigation chips and custom notes.
  - **AI Clarification Requests**: Individual interactive question cards with one-click saving and <kbd>Enter</kbd> keyboard shortcuts.
  - **"✨ Refine Brief with My Answers"**: Re-synthesizes the entire research architecture dynamically based on user decisions.
  - **Manual Brief Text Editor**: Full manual override for hypothesis, target segment, and sub-questions while keeping AI Strategic Focus outcome-based.

---

### 📂 3. Multi-Channel Evidence Ingestion & Synthesis
- **Structured Files (CSV / Excel / TSV)**:
  - Automated smart column mapping (Feedback Text, Ratings, Date, User Segment).
  - Data hygiene filter: Flags and excludes spam, blank entries, and one-word noise with transparent counts.
- **Unstructured Qualitative Data (Call & Interview Transcripts)**:
  - Speaker breakdown, verbatim quote extraction, and sentiment polarity.
- **UI Heatmaps & Screenshots**:
  - Ingests visual friction files with baseline satisfaction and drop-off rates.
- **Traceable Evidence Citation**: Every extracted theme and recommendation links directly back to verbatim source quotes and ticket IDs.

---

### ⚖️ 4. Research Sufficiency Assessment
Evaluates evidence against your core hypothesis to categorize the finding:
- **Outcome A — Sufficient Data**:
  - Statistical and qualitative evidence is complete.
  - Skips unnecessary surveys and moves straight to actionable insights and executive recommendations.
- **Outcome B — Knowledge Gap Identified**:
  - Existing evidence answers part of the hypothesis but lacks critical depth in specific cohorts or user actions.
  - Auto-generates a targeted, short micro-survey designed specifically to close the gap.
- **Outcome C — Insufficient / Exploratory**:
  - Sample size or variance is too low to draw definitive conclusions.
  - Recommends qualitative customer discovery calls and foundational data collection.

---

### 📊 5. Targeted Survey Builder & Live Distribution Hub
- **Auto-Generated Gap-Closing Surveys**:
  - Multi-choice, Likert rating scale, and open-ended exploratory questions.
  - Custom branding, progress indicator, and respondent preview.
- **Distribution Channels**:
  - Live public respondent survey link (`/#survey-:id`) with direct response logging.
  - Integrated email campaign composer with automated template generation.
  - Google Apps Script web-app webhook integration for zero-cost transactional email dispatch.
  - CSV recipient batch upload and recipient health validator.
- **Submissions Explorer**: Real-time telemetry, response logs, and timestamped answers.

---

### 📑 6. Boardroom Insights & Decision Reports
- **Executive Summary & Verdict**: Clean, concise briefing for stakeholders.
- **Interactive Matrix**: High Impact vs. Low Effort priority classification.
- **Verbatim Evidence Quotes**: Filterable quote bank with sentiment tagging and participant context.
- **Export Capabilities**:
  - Client-side vector PDF generation with charts and tables (`jspdf` + `html2canvas`).
  - Formatted markdown report download.
  - Direct clipboard copy for Slack, Notion, and email updates.

---

## 🛠️ Architecture & Tech Stack

```
├── Frontend (Client SPA)
│   ├── React 19 + TypeScript
│   ├── Tailwind CSS v4 (Light & Dark Theme Engine)
│   ├── Lucide Icons + Motion
│   └── Vite (Middleware dev server + production bundle)
│
├── Backend (API Proxy & Orchestration)
│   ├── Express.js (Node / TypeScript via tsx)
│   ├── Google Gemini API (@google/genai — 3.8-Flash)
│   └── Multi-layer Persistence (Local JSON store + optional Supabase cloud sync)
```

| Layer | Technologies |
|---|---|
| **Frontend Framework** | React 19, TypeScript, Tailwind CSS v4 |
| **Icons & Animation** | Lucide React, Motion |
| **PDF & Export** | jsPDF, html2canvas |
| **Server & API** | Express 4, Node.js, `tsx` |
| **AI Intelligence** | Google Gemini API (`@google/genai`, model: `gemini-3.8-flash`) |
| **Data Storage** | Local JSON Store (`/data/db.json`), optional Supabase integration |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `v20.x` or higher
- **npm** or **bun**
- **Gemini API Key**: Obtain a key from [Google AI Studio](https://aistudio.google.com/)

---

### Installation & Local Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/signaliq.git
   cd signaliq
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and add your Google Gemini API key:
   ```env
   GEMINI_API_KEY="your-gemini-api-key-here"
   PORT=3000
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open the application:**
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 Available NPM Scripts

| Script | Command | Purpose |
|---|---|---|
| `npm run dev` | `tsx server.ts` | Starts Express backend with Vite HMR middleware on port 3000 |
| `npm run build` | `vite build` | Compiles production assets into `/dist` |
| `npm run start` | `tsx server.ts` | Runs the full-stack server in production mode |
| `npm run lint` | `tsc --noEmit` | Runs TypeScript type checking |
| `npm run clean` | `rm -rf dist server.js` | Cleans build artifacts |

---

## 📂 Project Directory Structure

```
├── .env.example                # Environment variables template
├── metadata.json               # Applet configuration & permissions
├── package.json                # Project dependencies and scripts
├── server.ts                   # Express server, Gemini AI endpoints, DB persistence
├── vite.config.ts              # Vite configuration with React & Tailwind plugins
├── index.html                  # HTML entry point with SEO & meta tags
├── data/
│   └── db.json                 # Persistent local database (projects, surveys, responses)
└── src/
    ├── App.tsx                 # Root router, auth state, and global modals
    ├── index.css               # Global Tailwind CSS definitions
    ├── main.tsx                # React DOM entry point
    ├── types/
    │   └── index.ts            # Core TypeScript schemas (Project, Brief, Analysis, Survey)
    ├── lib/
    │   ├── api.ts              # Client API wrapper connecting to server endpoints
    │   └── sampleData.ts       # Realistic pre-loaded test datasets (CSVs, Transcripts)
    ├── context/
    │   └── ThemeContext.tsx    # Light / Dark theme state and persistence
    └── components/
        ├── Navbar.tsx                   # Top navigation with role filters & theme toggle
        ├── Dashboard.tsx                # Role-tailored KPIs, hero, and feature explorer
        ├── OnboardingQuestions.tsx      # Welcome questionnaire & persona customizer
        ├── BriefStep.tsx                # Step 1: Research brief & AI re-synthesis
        ├── EvidenceUploadStep.tsx       # Step 2: CSV, transcript, and heatmap ingestion
        ├── AnalysisStep.tsx             # Step 3: Sufficiency diagnostics & themes
        ├── SurveyBuilderStep.tsx        # Step 4: Targeted survey editor & questions
        ├── ReportStep.tsx               # Step 5: Executive report & PDF export
        ├── SurveysView.tsx              # Standalone survey list and distribution
        ├── SurveyDistributionModal.tsx  # Link sharing, email campaigns & Google Apps Script
        ├── PublicSurveyView.tsx         # Standalone public respondent interface
        ├── FeedbackExplorerView.tsx     # Global customer feedback and quotes explorer
        ├── SubmissionsExplorerView.tsx  # Live respondent submission log
        ├── SettingsView.tsx             # Email provider, quotas, and data management
        └── DocumentationView.tsx        # In-app product guide and documentation
```

---

## 🔒 Security & Privacy

- **Server-Side API Calls**: All Gemini AI prompts, analysis algorithms, and data parsers run securely server-side through Express. Client-side code never exposes API keys.
- **Data Hygiene & Scrubbing**: Automatically sanitizes customer text entries, strips tracking identifiers, and filters empty/spam inputs before running synthesis.
- **Zero Hallucination Anchoring**: Gemini prompts are strictly bounded to user-provided evidence quotes. No artificial reviews or imaginary metrics are generated.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
