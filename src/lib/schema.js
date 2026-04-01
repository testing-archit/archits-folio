/**
 * Appwrite Database Schema for AI Portfolio
 * Use this as a reference to set up your collections and attributes in the Appwrite Console.
 */

export const DATABASE_ID = "portfolio_db"; // You will need to create this in Appwrite

export const COLLECTIONS = {
  PROJECTS: {
    id: "projects",
    attributes: [
      { key: "name", type: "string", size: 255, required: true },
      { key: "github_url", type: "string", size: 512, required: true },
      { key: "description", type: "string", size: 5000, required: false },
      { key: "tech_stack", type: "string", size: 1024, required: false }, // Comma-separated or JSON string
      { key: "ai_summary", type: "string", size: 5000, required: false },
      { key: "last_updated", type: "datetime", required: false },
    ],
  },
  ACTIVITY_LOGS: {
    id: "activity_logs",
    attributes: [
      { key: "commit_message", type: "string", size: 1024, required: true },
      { key: "repo_name", type: "string", size: 255, required: true },
      { key: "timestamp", type: "datetime", required: true },
    ],
  },
  INSIGHTS: {
    id: "insights",
    attributes: [
      { key: "weekly_summary", type: "string", size: 5000, required: true },
      { key: "focus_area", type: "string", size: 255, required: false },
      { key: "skill_trends", type: "string", size: 2000, required: false }, // JSON breakdown
    ],
  },
  PROFILE: {
    id: "profile",
    attributes: [
      { key: "name", type: "string", size: 255, required: true },
      { key: "role", type: "string", size: 255, required: true },
      { key: "education", type: "string", size: 5000, required: false }, // JSON string
      { key: "experience", type: "string", size: 5000, required: false }, // JSON string
      { key: "achievements", type: "string", size: 5000, required: false }, // JSON string
      { key: "tagline", type: "string", size: 1024, required: false },
    ],
  },
  CASE_STUDIES: {
    id: "case_studies",
    attributes: [
      { key: "project_id", type: "string", size: 255, required: true },
      { key: "problem", type: "string", size: 5000, required: false },
      { key: "approach", type: "string", size: 5000, required: false },
      { key: "impact", type: "string", size: 5000, required: false },
      { key: "system_diagram_url", type: "string", size: 1024, required: false },
    ],
  },
  NOW_FEED: {
    id: "now_feed",
    attributes: [
      { key: "type", type: "string", size: 255, required: true }, // learning, building, exploring
      { key: "content", type: "string", size: 5000, required: true },
      { key: "timestamp", type: "datetime", required: true },
    ],
  },
  ANALYZER_HISTORY: {
    id: "analyzer_history",
    attributes: [
      { key: "username", type: "string", size: 255, required: true },
      { key: "insights_json", type: "string", size: 5000, required: true },
      { key: "timestamp", type: "datetime", required: true },
    ],
  },
};
