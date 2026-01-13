'use client';

import { useEffect, useState } from 'react';
import { NSFWPreference } from '@/lib/types';

const STORAGE_KEY = 'nsfwPreference';

const defaultPreference: NSFWPreference = {
  showNSFW: false,
  ageVerified: false,
};

type AgeVerificationOptions = {
  requireVerification: boolean;
  onDecline?: () => void;
};

const readStoredPreference = () => {
  try {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (!saved) {
      return null;
    }
    return JSON.parse(saved) as NSFWPreference;
  } catch {
    return null;
  }
};

export function useAgeVerification({ requireVerification, onDecline }: AgeVerificationOptions) {
  const [nsfwPreference, setNsfwPreference] = useState<NSFWPreference>(defaultPreference);
  const [showAgeModal, setShowAgeModal] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const stored = readStoredPreference();
    const nextPreference = stored ?? defaultPreference;

    setNsfwPreference(nextPreference);
    setShowAgeModal(requireVerification && !nextPreference.ageVerified);
    setIsReady(true);
  }, [requireVerification]);

  const confirmAge = () => {
    const newPreference: NSFWPreference = {
      showNSFW: true,
      ageVerified: true,
      verifiedAt: new Date().toISOString(),
    };

    setNsfwPreference(newPreference);
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(newPreference));
    setShowAgeModal(false);
  };

  const declineAge = () => {
    if (onDecline) {
      onDecline();
      return;
    }

    window.location.href = 'https://www.google.com';
  };

  return {
    nsfwPreference,
    showAgeModal,
    confirmAge,
    declineAge,
    isReady,
  };
}
