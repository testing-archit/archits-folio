import { Functions, Client } from "node-appwrite";

export async function POST(req) {
  const { username } = await req.json();

  const client = new Client()
    .setEndpoint(process.env.APPWRITE_FUNCTION_ENDPOINT)
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  const functions = new Functions(client);

  try {
    const execution = await functions.createExecution(
      'analyze-github', // Function ID
      JSON.stringify({ username }),
      false, // async
      '/', // path
      'POST'
    );

    const result = JSON.parse(execution.responseBody);
    return new Response(JSON.stringify(result), { status: execution.statusCode });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500 });
  }
}
