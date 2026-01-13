'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ImageData } from '@/lib/types';

interface ImageCardProps {
  image: ImageData;
  shouldBlur: boolean;
}

export function ImageCard({ image, shouldBlur }: ImageCardProps) {
  return (
    <Link href={`/en/image/${image.id}`}>
      <div className="group relative aspect-square rounded-lg overflow-hidden bg-gray-100 hover:shadow-lg transition-shadow cursor-pointer">
        <Image
          src={image.imageUrl}
          alt={image.prompt}
          fill
          className={`object-cover transition-transform group-hover:scale-105 ${
            shouldBlur ? 'nsfw-blur' : ''
          }`}
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        {image.isNSFW && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
            NSFW
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <p className="text-sm line-clamp-2">{image.prompt}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
