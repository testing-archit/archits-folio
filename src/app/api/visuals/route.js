import { Functions, Client } from "node-appwrite";

export async function POST(req) {
  const { type, custom_prompt } = await req.json();

  const client = new Client()
    .setEndpoint(process.env.APPWRITE_FUNCTION_ENDPOINT)
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  const functions = new Functions(client);

  try {
    const execution = await functions.createExecution(
      'generate-visuals', // Function ID
      JSON.stringify({ type, custom_prompt }),
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
