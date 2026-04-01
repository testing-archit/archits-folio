import { Client, Databases, ID, Query } from 'node-appwrite';
import fetch from 'node-fetch';

export default async ({ req, res, log, error }) => {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_FUNCTION_ENDPOINT)
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  const databases = new Databases(client);
  const GITHUB_USERNAME = 'testing-archit';
  const DATABASE_ID = 'portfolio_db';
  const PROJECTS_COLLECTION = 'projects';
  const LOGS_COLLECTION = 'activity_logs';

  try {
    // 1. Fetch Repositories
    const reposRes = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=10`);
    if (!reposRes.ok) throw new Error('Failed to fetch repos');
    const repos = await reposRes.json();

    log(`Fetched ${repos.length} repositories`);

    for (const repo of repos) {
      const existing = await databases.listDocuments(DATABASE_ID, PROJECTS_COLLECTION, [
        Query.equal('github_url', repo.html_url)
      ]);

      const data = {
        name: repo.name,
        github_url: repo.html_url,
        description: repo.description || 'No description provided.',
        tech_stack: repo.topics ? repo.topics.join(', ') : '',
        last_updated: new Date(repo.updated_at).toISOString(),
      };

      if (existing.total > 0) {
        await databases.updateDocument(DATABASE_ID, PROJECTS_COLLECTION, existing.documents[0].$id, data);
      } else {
        await databases.createDocument(DATABASE_ID, PROJECTS_COLLECTION, ID.unique(), data);
      }
    }

    // 2. Fetch Commits (Activity Logs)
    const eventsRes = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/events/public?per_page=20`);
    if (!eventsRes.ok) throw new Error('Failed to fetch events');
    const events = await eventsRes.json();

    const pushEvents = events.filter(e => e.type === 'PushEvent');
    log(`Fetched ${pushEvents.length} push events`);

    for (const event of pushEvents) {
      for (const commit of event.payload.commits) {
        const existing = await databases.listDocuments(DATABASE_ID, LOGS_COLLECTION, [
          Query.equal('timestamp', new Date(event.created_at).toISOString()),
          Query.equal('commit_message', commit.message)
        ]);

        if (existing.total === 0) {
          await databases.createDocument(DATABASE_ID, LOGS_COLLECTION, ID.unique(), {
            commit_message: commit.message,
            repo_name: event.repo.name,
            timestamp: new Date(event.created_at).toISOString(),
          });
        }
      }
    }

    return res.json({ success: true, message: 'Sync completed' });
  } catch (err) {
    error(err.message);
    return res.json({ success: false, error: err.message }, 500);
  }
};
