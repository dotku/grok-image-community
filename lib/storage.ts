import { put } from '@vercel/blob';
import { promises as fs } from 'fs';
import path from 'path';
import { ImageData } from './types';

const IMAGES_JSON_PATH = path.join(process.cwd(), 'data', 'images.json');

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

  // Add new image
  existingImages.unshift(imageData); // Add to beginning

  // Save to JSON file
  await fs.writeFile(IMAGES_JSON_PATH, JSON.stringify(existingImages, null, 2));

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
    const data = await fs.readFile(IMAGES_JSON_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist, return empty array
    return [];
  }
}

export async function getImageById(id: string): Promise<ImageData | null> {
  const images = await getImages();
  return images.find(img => img.id === id) || null;
}
