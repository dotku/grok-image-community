'use client';

import { useTranslations } from 'next-intl';
import { GenerateForm } from '@/components/GenerateForm';

export default function GeneratePage() {
  const t = useTranslations('generate');

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-4xl font-bold text-center mb-2">
          {t('title')}
        </h1>
        <p className="text-center text-gray-600 mb-2">
          Create AI art with unrestricted creative freedom
        </p>
        <p className="text-center text-sm text-gray-500 mb-8">
          Powered by Lustify v7 (Uncensored)
        </p>

        <GenerateForm />
      </main>
    </div>
  );
}
