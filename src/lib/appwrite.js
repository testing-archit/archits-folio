import { Client, Account, Databases } from "appwrite";

const client = new Client()
  .setEndpoint("https://sgp.cloud.appwrite.io/v1")
  .setProject("69cd5b430036eb03bf7a");

const account = new Account(client);
const databases = new Databases(client);

export const DATABASE_ID = "portfolio_db";
export const COLLECTIONS = {
  PROJECTS: "projects",
  ACTIVITY_LOGS: "activity_logs",
  INSIGHTS: "insights",
  PROFILE: "profile",
  CASE_STUDIES: "case_studies",
  NOW_FEED: "now_feed",
  ANALYZER_HISTORY: "analyzer_history",
};

export { client, account, databases };
