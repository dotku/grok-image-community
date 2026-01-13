import { NextRequest, NextResponse } from 'next/server';
import { generateImage } from '@/lib/grok-api';
import { saveImage, uploadImageToBlob } from '@/lib/storage';
import { detectNSFWFromPrompt } from '@/lib/nsfw-detection';
import { APP_CONFIG } from '@/lib/constants';
import { GenerationResponse } from '@/lib/types';

// Increase timeout for image generation (60 seconds)
export const maxDuration = 60;

// Simple in-memory rate limiting (for MVP)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const userLimit = rateLimitMap.get(ip);

  if (!userLimit || now > userLimit.resetTime) {
    rateLimitMap.set(ip, {
      count: 1,
      resetTime: now + APP_CONFIG.rateLimit.windowMs,
    });
    return true;
  }

  if (userLimit.count >= APP_CONFIG.rateLimit.maxRequests) {
    return false;
  }

  userLimit.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    const { prompt, locale } = await request.json();

    // Validate prompt
    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Prompt is required' } as GenerationResponse,
        { status: 400 }
      );
    }

    if (prompt.length < APP_CONFIG.minPromptLength || prompt.length > APP_CONFIG.maxPromptLength) {
      return NextResponse.json(
        { success: false, error: `Prompt must be between ${APP_CONFIG.minPromptLength} and ${APP_CONFIG.maxPromptLength} characters` } as GenerationResponse,
        { status: 400 }
      );
    }

    // Check rate limit
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { success: false, error: 'Rate limit exceeded. Please try again later.' } as GenerationResponse,
        { status: 429 }
      );
    }

    // Detect NSFW
    const isNSFW = detectNSFWFromPrompt(prompt);

    // Generate image with Venice
    const veniceResponse = await generateImage(prompt);

    if (!veniceResponse.data || veniceResponse.data.length === 0) {
      throw new Error('No image generated');
    }

    // Get base64 image data
    const b64Data = veniceResponse.data[0].b64_json;
    if (!b64Data) {
      throw new Error('No image data received from Venice');
    }

    // Convert base64 to buffer
    const imageBuffer = Buffer.from(b64Data, 'base64');

    // Upload to Vercel Blob
    const filename = `${Date.now()}-${crypto.randomUUID()}.png`;
    const blobUrl = await uploadImageToBlob(imageBuffer, filename);

    // Save metadata
    const imageData = await saveImage(blobUrl, prompt, locale || 'en', isNSFW);

    return NextResponse.json({
      success: true,
      data: imageData,
    } as GenerationResponse);

  } catch (error) {
    console.error('Generation error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate image',
      } as GenerationResponse,
      { status: 500 }
    );
  }
}
