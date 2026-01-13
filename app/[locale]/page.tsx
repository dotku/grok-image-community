'use client';

import { useTranslations } from 'next-intl';
import { ImageGallery } from '@/components/ImageGallery';

export default function Home() {
  const t = useTranslations('gallery');

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">
          {t('title')}
        </h1>
        <ImageGallery />
      </main>
    </div>
  );
}
