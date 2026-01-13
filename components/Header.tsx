'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';

export function Header() {
  const pathname = usePathname();
  const t = useTranslations();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/en" className="text-xl font-bold text-primary">
              {t('header.appName')}
            </Link>
            <span className="text-sm text-gray-500 hidden sm:inline">
              {t('header.tagline')}
            </span>
          </div>

          <nav className="flex items-center gap-6">
            <Link
              href="/en"
              className={`font-medium transition-colors hover:text-primary ${
                isActive('/en') ? 'text-primary' : 'text-foreground'
              }`}
            >
              {t('nav.gallery')}
            </Link>
            <Link
              href="/en/generate"
              className={`font-medium transition-colors hover:text-primary ${
                isActive('/en/generate') ? 'text-primary' : 'text-foreground'
              }`}
            >
              {t('nav.generate')}
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
