import { GoogleGenerativeAI } from "@google/generative-ai";
import { Databases, Client } from "node-appwrite";

export async function POST(req) {
  const { message } = await req.json();

  // 1. Fetch Dynamic Context from Appwrite
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  const databases = new Databases(client);
  let dynamicContext = "";

  try {
    const profile = await databases.listDocuments('portfolio_db', 'profile');
    if (profile.documents.length > 0) {
      const doc = profile.documents[0];
      dynamicContext = `
        Name: ${doc.name}
        Role: ${doc.role}
        Education: ${doc.education}
        Experience: ${doc.experience}
        Achievements: ${doc.achievements}
      `;
    }
  } catch (err) {
    console.error("Context fetch failed:", err);
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const context = `
    You are the AI assistant for Archit Gupta's developer portfolio.
    Archit's profile:
    ${dynamicContext}
    
    Goal: Build a live, automated developer intelligence platform.
    Rules:
    - Be professional, concise, and technically sharp.
    - If asked about "What he is doing now", mention he is building this portfolio using Appwrite and Next.js.
  `;

  try {
    const result = await model.generateContent(`${context}\n\nUser Question: ${message}`);
    const text = result.response.text();
    return new Response(JSON.stringify({ text }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
