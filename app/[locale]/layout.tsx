import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from '@/i18n/request';
import { Header } from '@/components/Header';
import "./globals.css";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const messages = await getMessages({ locale }) as any;

  return {
    title: messages.metadata?.title || "NSFW Images Generator - AI Art Community",
    description: messages.metadata?.description || "Generate and share AI art with unrestricted creative freedom",
    keywords: ['AI', 'image generation', 'NSFW', 'adult', 'art', 'community', 'unrestricted'],
    openGraph: {
      type: 'website',
      locale: locale,
      siteName: 'NSFW Images Generator',
    }
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className="antialiased bg-background text-foreground">
        <NextIntlClientProvider messages={messages}>
          <Header />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
