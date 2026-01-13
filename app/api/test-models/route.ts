import { NextResponse } from 'next/server';
import { listModels } from '@/lib/grok-api';

export async function GET() {
  try {
    const models = await listModels();
    return NextResponse.json({ success: true, models });
  } catch (error) {
    console.error('Failed to fetch models:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch models'
      },
      { status: 500 }
    );
  }
}
