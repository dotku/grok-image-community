'use client';

import { useTranslations } from 'next-intl';
import { GenerateForm } from '@/components/GenerateForm';
import { AgeVerificationModal } from '@/components/AgeVerificationModal';
import { useAgeVerification } from '@/components/useAgeVerification';

export default function GeneratePage() {
  const t = useTranslations('generate');
  const tNsfw = useTranslations('nsfw');
  const {
    nsfwPreference,
    showAgeModal,
    confirmAge,
    declineAge,
    isReady,
  } = useAgeVerification({ requireVerification: true });

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

        {isReady && nsfwPreference.ageVerified ? (
          <GenerateForm />
        ) : (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">🔞</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {tNsfw('ageVerification')}
            </h2>
            <p className="text-gray-600">
              {tNsfw('ageVerificationMessage')}
            </p>
          </div>
        )}
      </main>

      {showAgeModal && (
        <AgeVerificationModal
          onConfirm={confirmAge}
          onDecline={declineAge}
        />
      )}
    </div>
  );
}
