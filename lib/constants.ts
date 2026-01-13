export const APP_CONFIG = {
  name: 'NSFW Images Generator',
  description: 'AI Image Generation Community with unrestricted creative freedom',
  model: 'lustify-v7',
  modelName: 'Lustify v7 (Uncensored)',
  maxPromptLength: 1000,
  minPromptLength: 10,
  rateLimit: {
    maxRequests: 5,
    windowMs: 3600000 // 1 hour
  }
};

export const NSFW_KEYWORDS = [
  'nude', 'nsfw', 'explicit', 'adult', 'naked', 'sex', 'porn',
  'erotic', 'sexual', 'xxx', 'hentai', 'lewd'
];

export const EXAMPLE_PROMPTS = [
  'A majestic mountain landscape at sunset with a river flowing through the valley',
  'A futuristic cityscape with flying cars and neon lights at night',
  'A cozy coffee shop interior with warm lighting and plants',
  'A cyberpunk street scene with rain and reflections',
  'An underwater coral reef with colorful fish and marine life',
];
