'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { ImageData } from '@/lib/types';

export default function ImageDetailPage() {
  const params = useParams();
  const router = useRouter();
  const t = useTranslations('image');
  const [image, setImage] = useState<ImageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchImage() {
      try {
        const response = await fetch(`/api/images/${params.id}`);
        const data = await response.json();

        if (data.success) {
          setImage(data.data);
        } else {
          console.error('Failed to load image');
        }
      } catch (error) {
        console.error('Error fetching image:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchImage();
  }, [params.id]);

  const handleCopyPrompt = () => {
    if (image) {
      navigator.clipboard.writeText(image.prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse text-lg text-gray-600">
            Loading...
          </div>
        </div>
      </div>
    );
  }

  if (!image) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Image not found</h1>
          <Button onClick={() => router.push('/en')}>
            {t('backToGallery')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-6">
          <Button variant="secondary" onClick={() => router.push('/en')}>
            ← {t('backToGallery')}
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
            <Image
              src={image.imageUrl}
              alt={image.prompt}
              fill
              className="object-contain"
              priority
            />
            {image.isNSFW && (
              <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                NSFW
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-sm font-medium text-gray-500 mb-2">
                {t('prompt')}
              </h2>
              <p className="text-lg leading-relaxed">{image.prompt}</p>
              <Button
                variant="secondary"
                onClick={handleCopyPrompt}
                className="mt-4"
              >
                {copied ? t('copiedPrompt') : t('copyPrompt')}
              </Button>
            </div>

            <div>
              <h2 className="text-sm font-medium text-gray-500 mb-2">
                {t('generatedAt')}
              </h2>
              <p className="text-gray-700">
                {new Date(image.createdAt).toLocaleString()}
              </p>
            </div>

            <div>
              <h2 className="text-sm font-medium text-gray-500 mb-2">
                Model
              </h2>
              <p className="text-gray-700">{image.model || 'AI Generated'}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
