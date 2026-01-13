export interface ImageGenerationResponse {
  data: Array<{
    url: string;
    b64_json?: string;
  }>;
  created: number;
}

export async function generateImage(prompt: string): Promise<ImageGenerationResponse> {
  const apiKey = process.env.VENICE_API_KEY;

  if (!apiKey) {
    throw new Error('VENICE_API_KEY environment variable is not set');
  }

  const response = await fetch('https://api.venice.ai/api/v1/images/generations', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt: prompt,
      background: 'auto',
      model: 'lustify-v7',
      moderation: 'low',
      n: 1,
      output_compression: 100,
      output_format: 'png',
      quality: 'auto',
      response_format: 'b64_json',
      size: 'auto',
      style: 'natural',
      user: 'user123',
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Venice AI error: ${response.status} - ${error}`);
  }

  return await response.json();
}
