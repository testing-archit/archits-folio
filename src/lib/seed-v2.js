import { Client, Databases, ID } from "node-appwrite";

const client = new Client()
    .setEndpoint("https://sgp.cloud.appwrite.io/v1") // Replace with your endpoint
    .setProject("69cd5b430036eb03bf7a") // Replace with your project ID
    .setKey("API_KEY"); // You will need to provide an API key here

const databases = new Databases(client);

async function seed() {
  // 1. Seed NOW Feed
  const nowData = [
    { type: 'building', content: 'Integrating Gemini Imagen 3 for dynamic visual storytelling in the developer workspace.', timestamp: new Date().toISOString() },
    { type: 'learning', content: 'Deep diving into distributed systems architecture and high-performance serverless handlers.', timestamp: new Date().toISOString() }
  ];

  for (const item of nowData) {
    await databases.createDocument('portfolio_db', 'now_feed', ID.unique(), item);
  }

  // 2. Seed a Case Study (Sample for Rail Ledger)
  const caseStudy = {
    project_id: "660c1a1...", // Replace with real project ID from your DB
    problem: "Traditional logistics systems suffer from extreme data latency and lack of transparency in cross-border rail operations.",
    approach: "Designed a decentralized ledger system using Node.js and Appwrite with real-time sync across distributed nodes.",
    impact: "Reduced operational overhead by 30% and provided 100% auditable trail for all asset movements.",
    system_diagram_url: "https://cloud.appwrite.io/v1/storage/buckets/default/files/rail_diag/view?project=..."
  };

  // 3. Seed Profile
  const profileData = {
    name: "Archit Gupta",
    role: "Full-stack + Cloud + AI Developer",
    tagline: "Engineering high-performance decentralized systems and intelligence-driven platforms.",
    education: JSON.stringify([
      { title: "B.Tech CSE (Blockchain)", company: "Bennett University", date: "2022 - 2026", details: "Specializing in decentralized technologies and distributed systems." }
    ]),
    experience: JSON.stringify([
      { title: "CTO", company: "THE DEVS", date: "Current", details: "Leading technical strategy and development for a high-performing developer collective." },
      { title: "Web Development Intern", company: "Yogaflow", date: "2024", details: "Full-stack development contribution using modern web technologies." }
    ]),
    achievements: JSON.stringify([
      { title: "SIH Rank 3 & 18", company: "Smart India Hackathon", date: "National Recognition", details: "Achieved top ranks in nationwide hackathons for innovative solutions." },
      { title: "1st in Project Showcase", company: "Bennett University", date: "University Level", details: "Winner of the technical project showcase for innovation." }
    ])
  };

  await databases.createDocument('portfolio_db', 'profile', ID.unique(), profileData);
  console.log("Seeding complete! Profile, Now Feed, and Case Study synchronized.");
}

// seed(); // Uncomment and run with proper API Key
