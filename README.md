# ARCHIT.INTEL | Developer Intelligence Platform

A production-grade, AI-powered, real-time developer portfolio for **Archit Gupta**. This platform is a live dashboard of engineering activity, skills evolution, and strategic growth.

## 🧠 System Architecture

- **Next.js (App Router)**: Modern React framework for the frontend.
- **Appwrite Backend**: Real-time database, serverless functions, and secure authentication.
- **AI Layer (Gemini Pro)**: Automated weekly summaries, skill trend analysis, and a contextual chatbot.
- **Framer Motion**: Premium glassmorphism UI with smooth animations.

## 🚀 Key Features

1. **Live Activity Pulse**: Real-time monitoring of GitHub commits via Appwrite Realtime.
2. **Curated Intelligence**: AI-enhanced project showcase synced with GitHub repositories.
3. **Strategic Journey**: Professional timeline featuring key milestones and national achievements.
4. **AI Conversational Agent**: Interactive chatbot trained on Archit's specific technical profile.

## 🛠️ Setup & Deployment

### 1. Appwrite Configuration
- Create a database `portfolio_db`.
- Create collections: `projects`, `activity_logs`, `insights`, and `profile` (Reference: `src/lib/schema.js`).
- Deploy serverless functions from the `/functions` directory.

### 2. Environment Variables
Update your Appwrite Function settings with:
- `GITHUB_TOKEN`: Your GitHub Personal Access Token.
- `GEMINI_API_KEY`: Your Google Generative AI API key.
- `APPWRITE_API_KEY`: An API key with database and function execution permissions.

### 3. Local Development
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view your intelligence feed.

## 📄 Source Attribution
Inspired by Vercel and Linear design systems. Powered by Appwrite and Gemini.# archits-folio
