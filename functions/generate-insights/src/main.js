import { Client, Databases, ID } from 'node-appwrite';
import { GoogleGenerativeAI } from '@google/generative-ai';

export default async ({ req, res, log, error }) => {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_FUNCTION_ENDPOINT)
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  const databases = new Databases(client);
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const DATABASE_ID = 'portfolio_db';
  const PROJECTS_COLLECTION = 'projects';
  const LOGS_COLLECTION = 'activity_logs';
  const INSIGHTS_COLLECTION = 'insights';

  try {
    // 1. Fetch data for context
    const repos = await databases.listDocuments(DATABASE_ID, PROJECTS_COLLECTION);
    const logs = await databases.listDocuments(DATABASE_ID, LOGS_COLLECTION);

    const context = `
      Projects: ${repos.documents.map(r => `${r.name}: ${r.description}`).join(', ')}
      Recent Commits: ${logs.documents.map(l => `${l.repo_name}: ${l.commit_message}`).join(', ')}
    `;

    // 2. Generate AI Insights
    const prompt = `
      Based on the following developer activity and projects, generate:
      1. A one-sentence weekly summary of the focuses and progress.
      2. The primary focus area (e.g. "Backend Refactoring", "Mobile UI").
      3. A prediction of skill trends (e.g. "Increasing Node.js usage").

      Context:
      ${context}

      Respond strictly in the following JSON format:
      {
        "weekly_summary": "...",
        "focus_area": "...",
        "skill_trends": "..."
      }
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const insights = JSON.parse(responseText.substring(responseText.indexOf('{'), responseText.lastIndexOf('}') + 1));

    // 3. Update Insights Collection
    await databases.createDocument(DATABASE_ID, INSIGHTS_COLLECTION, ID.unique(), insights);

    return res.json({ success: true, insights });
  } catch (err) {
    error(err.message);
    return res.json({ success: false, error: err.message }, 500);
  }
};
