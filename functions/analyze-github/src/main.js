import axios from 'axios';
import { Client, Databases, ID } from 'node-appwrite';
import { GoogleGenerativeAI } from '@google/generative-ai';

export default async ({ req, res, log, error }) => {
  const { username } = JSON.parse(req.body);

  if (!username) {
    return res.json({ success: false, message: "Username is required" }, 400);
  }

  // 1. Fetch GitHub data
  try {
    const [userRes, reposRes] = await Promise.all([
      axios.get(`https://api.github.com/users/${username}`),
      axios.get(`https://api.github.com/users/${username}/repos?sort=updated&per_page=10`)
    ]);

    const userData = userRes.data;
    const reposData = reposRes.data.map(repo => ({
      name: repo.name,
      description: repo.description,
      language: repo.language,
      stars: repo.stargazers_count
    }));

    // 2. AI Analysis with Gemini
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `
      Analyze this GitHub developer profile:
      Name: ${userData.name || username}
      Bio: ${userData.bio || 'N/A'}
      Followers: ${userData.followers}
      Public Repos: ${userData.public_repos}
      Recent Repos: ${JSON.stringify(reposData)}

      Based on this data, provide a professional developer assessment in JSON format:
      {
        "skill_breakdown": { "Primary Topic": "Weight %" },
        "activity_insights": "Detailed summary of commit and project patterns",
        "improvement_suggestions": ["Specific technical growth area 1", "Specific growth area 2"],
        "developer_persona": "A creative title (e.g., 'Modern Frontend Architect', 'Full-Stack Problem Solver')",
        "estimated_score": 0 (out of 100)
      }
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const insights = JSON.parse(responseText.substring(responseText.indexOf('{'), responseText.lastIndexOf('}') + 1));

    // 3. Save to Appwrite if possible
    if (process.env.APPWRITE_FUNCTION_PROJECT_ID) {
      const client = new Client()
        .setEndpoint(process.env.APPWRITE_FUNCTION_ENDPOINT)
        .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
        .setKey(process.env.APPWRITE_API_KEY);
      
      const databases = new Databases(client);
      try {
        await databases.createDocument(
          'portfolio_db', 
          'analyzer_history', 
          ID.unique(), 
          {
            username: username,
            insights_json: JSON.stringify(insights),
            timestamp: new Date().toISOString()
          }
        );
      } catch (dbErr) {
        log("Database logging failed, returning insights anyway");
      }
    }

    return res.json({ success: true, data: insights });
  } catch (err) {
    error(err.message);
    if (err.response?.status === 404) {
      return res.json({ success: false, message: "User not found" }, 404);
    }
    return res.json({ success: false, message: "Failed to analyze profile" }, 500);
  }
};
