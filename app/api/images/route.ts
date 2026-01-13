import { NextResponse } from 'next/server';
import { getImages } from '@/lib/storage';

export async function GET() {
  try {
    const images = await getImages();
    return NextResponse.json({ success: true, data: images });
  } catch (error) {
    console.error('Failed to fetch images:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch images' },
      { status: 500 }
    );
  }
}
