import { NSFW_KEYWORDS } from './constants';

export function detectNSFWFromPrompt(prompt: string): boolean {
  const lowerPrompt = prompt.toLowerCase();
  return NSFW_KEYWORDS.some(keyword => lowerPrompt.includes(keyword));
}
