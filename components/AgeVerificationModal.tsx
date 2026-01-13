'use client';

import { useTranslations } from 'next-intl';
import { Button } from './ui/Button';

interface AgeVerificationModalProps {
  onConfirm: () => void;
  onDecline: () => void;
}

export function AgeVerificationModal({ onConfirm, onDecline }: AgeVerificationModalProps) {
  const t = useTranslations('nsfw');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-8">
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">🔞</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {t('ageVerification')}
          </h2>
          <p className="text-gray-600">
            {t('ageVerificationMessage')}
          </p>
        </div>

        <div className="space-y-3">
          <Button
            onClick={onConfirm}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          >
            {t('confirmAge')}
          </Button>
          <button
            onClick={onDecline}
            className="w-full px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            {t('declineAge')}
          </button>
        </div>

        <p className="text-xs text-gray-500 text-center mt-6">
          {t('ageVerificationDisclaimer')}
        </p>
      </div>
    </div>
  );
}
