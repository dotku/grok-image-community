'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Button } from './ui/Button';
import { APP_CONFIG, EXAMPLE_PROMPTS } from '@/lib/constants';

export function GenerateForm() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const t = useTranslations('generate');
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (prompt.length < APP_CONFIG.minPromptLength) {
      setError(t('minLength'));
      return;
    }

    if (prompt.length > APP_CONFIG.maxPromptLength) {
      setError(t('maxLength'));
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, locale: 'en' }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate image');
      }

      router.push(`/en/image/${data.data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('error'));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExampleClick = (examplePrompt: string) => {
    setPrompt(examplePrompt);
    setError('');
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium mb-2">
            {t('promptLabel')}
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={t('promptPlaceholder')}
            className="w-full min-h-[120px] p-4 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors"
            disabled={isGenerating}
          />
          <div className="flex justify-between mt-2 text-sm text-gray-500">
            <span>
              {prompt.length} {t('characterCount')}
            </span>
            <span>
              {APP_CONFIG.minPromptLength}-{APP_CONFIG.maxPromptLength} {t('characterCount')}
            </span>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <Button
          type="submit"
          disabled={isGenerating || prompt.length < APP_CONFIG.minPromptLength}
          className="w-full sm:w-auto"
        >
          {isGenerating ? t('generating') : t('generateButton')}
        </Button>
      </form>

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">{t('examplesTitle')}</h3>
        <div className="grid gap-3">
          {EXAMPLE_PROMPTS.map((example, index) => (
            <button
              key={index}
              onClick={() => handleExampleClick(example)}
              className="text-left p-4 rounded-lg border border-gray-200 hover:border-primary hover:bg-primary/5 transition-colors"
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
