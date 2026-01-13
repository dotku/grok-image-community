'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { ImageData, NSFWPreference } from '@/lib/types';
import { ImageCard } from './ImageCard';
import Link from 'next/link';
import { Button } from './ui/Button';
import { AgeVerificationModal } from './AgeVerificationModal';

export function ImageGallery() {
  const [images, setImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAgeModal, setShowAgeModal] = useState(false);
  const [nsfwPreference, setNsfwPreference] = useState<NSFWPreference>({
    showNSFW: false,  // Default to blurred
    ageVerified: false,
  });
  const t = useTranslations('gallery');

  useEffect(() => {
    // Load NSFW preference from localStorage
    const saved = localStorage.getItem('nsfwPreference');
    if (saved) {
      const pref = JSON.parse(saved);
      setNsfwPreference(pref);
      // Show age modal if not verified
      if (!pref.ageVerified) {
        setShowAgeModal(true);
      }
    } else {
      // First time visitor - show age verification modal
      setShowAgeModal(true);
    }

    // Fetch images
    async function fetchImages() {
      try {
        const response = await fetch('/api/images');
        const data = await response.json();

        if (data.success) {
          setImages(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch images:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchImages();
  }, []);

  const handleAgeConfirm = () => {
    const newPref: NSFWPreference = {
      showNSFW: true,
      ageVerified: true,
      verifiedAt: new Date().toISOString(),
    };
    setNsfwPreference(newPref);
    localStorage.setItem('nsfwPreference', JSON.stringify(newPref));
    setShowAgeModal(false);
  };

  const handleAgeDecline = () => {
    // Redirect to a safe page or show message
    window.location.href = 'https://www.google.com';
  };

  const visibleImages = nsfwPreference.showNSFW
    ? images
    : images.filter(img => !img.isNSFW);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-pulse text-lg text-gray-600">
            {t('loading')}
          </div>
        </div>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-6">
        <p className="text-lg text-gray-600">
          {t('noImages')}
        </p>
        <Link href="/en/generate">
          <Button>Create Your First Image</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="text-sm text-gray-600">
          {t('showing')} {visibleImages.length} of {images.length} {t('totalImages').toLowerCase()}
          {!nsfwPreference.showNSFW && images.length > visibleImages.length && (
            <span className="ml-2 text-gray-500">
              ({images.length - visibleImages.length} {t('hidden')})
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {visibleImages.map((image) => (
          <ImageCard
            key={image.id}
            image={image}
            shouldBlur={image.isNSFW && !nsfwPreference.showNSFW}
          />
        ))}
      </div>

      {showAgeModal && (
        <AgeVerificationModal
          onConfirm={handleAgeConfirm}
          onDecline={handleAgeDecline}
        />
      )}
    </div>
  );
}
