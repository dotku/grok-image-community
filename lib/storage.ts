import { put } from '@vercel/blob';
import Redis from 'ioredis';
import { ImageData } from './types';

const IMAGES_KEY = 'images';

// Create Redis client
const redis = new Redis(process.env.REDIS_URL || '');

export async function saveImage(
  imageUrl: string,
  prompt: string,
  locale: string,
  isNSFW: boolean
): Promise<ImageData> {
  const imageData: ImageData = {
    id: crypto.randomUUID(),
    prompt,
    imageUrl,
    isNSFW,
    createdAt: new Date().toISOString(),
    locale,
    model: 'lustify-v7',
  };

  // Read existing images
  const existingImages = await getImages();

  // Add new image to beginning
  existingImages.unshift(imageData);

  // Save to Redis
  await redis.set(IMAGES_KEY, JSON.stringify(existingImages));

  return imageData;
}

export async function uploadImageToBlob(imageBuffer: Buffer, filename: string): Promise<string> {
  const blob = await put(filename, imageBuffer, {
    access: 'public',
    contentType: 'image/png',
  });

  return blob.url;
}

export async function getImages(): Promise<ImageData[]> {
  try {
    const data = await redis.get(IMAGES_KEY);
    if (!data) return [];
    return JSON.parse(data) as ImageData[];
  } catch (error) {
    console.error('Error fetching images from Redis:', error);
    return [];
  }
}

export async function getImageById(id: string): Promise<ImageData | null> {
  const images = await getImages();
  return images.find(img => img.id === id) || null;
}
