import axios from 'axios';
import { GoogleAuth } from 'google-auth-library';

export default async ({ req, res, log, error }) => {
  const { type, custom_prompt } = JSON.parse(req.body);

  if (!type && !custom_prompt) {
    return res.json({ success: false, message: "Type or prompt is required" }, 400);
  }

  const PROJECT_ID = process.env.GCP_PROJECT_ID;
  const LOCATION = process.env.GCP_LOCATION || 'us-central1';
  const MODEL_ID = 'imagen-3.0-generate-001';

  let finalPrompt = custom_prompt;
  if (type === 'hero_portrait') {
    finalPrompt = "Professional developer portrait of a male engineer, minimalist tech aesthetic, futuristic cyberpunk accents, dark background, neon blue glowing highlights, 8k resolution, cinematic photography style.";
  } else if (type === 'system_diagram') {
    finalPrompt = "Detailed high-tech system architecture diagram, isometric view, cyan and pink glowing blueprint style, clean modern icons, dark background, technical illustration.";
  }

  try {
    const auth = new GoogleAuth({
      scopes: 'https://www.googleapis.com/auth/cloud-platform'
    });
    const client = await auth.getClient();
    const tokenResponse = await client.getAccessToken();
    const accessToken = tokenResponse.token;

    const url = `https://${LOCATION}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/${MODEL_ID}:predict`;

    const body = {
      instances: [
        {
          prompt: finalPrompt
        }
      ],
      parameters: {
        sampleCount: 1,
        aspectRatio: "1:1",
        includeGenerationParameters: true
      }
    };

    const response = await axios.post(url, body, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    const imageBase64 = response.data.predictions[0].bytesBase64Encoded;
    return res.json({ success: true, base64: imageBase64 });
  } catch (err) {
    error("Visual generation failed: " + err.message);
    return res.json({ success: false, message: "Failed to generate visual content" }, 500);
  }
};
