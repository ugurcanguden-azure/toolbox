import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Inter } from 'next/font/google';
import { ThemeProvider, Header, Footer, CookieConsent, GlobalLoading, NavigationListener } from '@/components';
import { LoadingProvider } from '@/contexts';
import { locales, type Locale } from '@/i18n/request';
import '@/styles/globals.css';
import type { Metadata } from 'next';

const inter = Inter({ subsets: ['latin'] });

// Force dynamic rendering for next-intl compatibility
export const dynamic = 'force-dynamic';
export const dynamicParams = true;

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ locale: string }> 
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'common' });
  
  // Locale mapping for OpenGraph
  const ogLocaleMap: Record<string, string> = {
    en: 'en_US',
    de: 'de_DE',
    tr: 'tr_TR',
    fr: 'fr_FR',
    pt: 'pt_BR',
    es: 'es_ES',
    it: 'it_IT',
    nl: 'nl_NL',
    ja: 'ja_JP',
    ru: 'ru_RU',
  };
  
  return {
    title: {
      default: t('appName'),
      template: `%s | ${t('appName')}`,
    },
    description: t('appDescription'),
    keywords: [
      'developer tools',
      'online tools',
      'json formatter',
      'base64 encoder',
      'url encoder',
      'password generator',
      'uuid generator',
      'hash generator',
      'color converter',
      'regex tester',
      'text tools',
      'free tools',
      'web tools',
      'coding tools',
    ],
    authors: [{ name: 'Developer Tools' }],
    creator: 'Developer Tools',
    publisher: 'Developer Tools',
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      title: t('appName'),
      description: t('appDescription'),
      type: 'website',
      locale: ogLocaleMap[locale] || 'en_US',
      alternateLocale: Object.values(ogLocaleMap).filter(l => l !== ogLocaleMap[locale]),
      siteName: t('appName'),
            url: `https://free-dev-tools.net.tr/${locale}`,
            images: [
              {
                url: 'https://free-dev-tools.net.tr/og-image.svg',
          width: 1200,
          height: 630,
          alt: 'Toolbox - 30+ Free Developer Tools',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('appName'),
      description: t('appDescription'),
      creator: '@toolbox',
      site: '@toolbox',
      images: ['https://free-dev-tools.net.tr/og-image.svg'],
    },
    alternates: {
      canonical: `https://free-dev-tools.net.tr/${locale}`,
      languages: {
        'en': 'https://free-dev-tools.net.tr/en',
        'de': 'https://free-dev-tools.net.tr/de',
        'tr': 'https://free-dev-tools.net.tr/tr',
        'fr': 'https://free-dev-tools.net.tr/fr',
        'pt': 'https://free-dev-tools.net.tr/pt',
        'es': 'https://free-dev-tools.net.tr/es',
        'it': 'https://free-dev-tools.net.tr/it',
        'nl': 'https://free-dev-tools.net.tr/nl',
        'ja': 'https://free-dev-tools.net.tr/ja',
        'ru': 'https://free-dev-tools.net.tr/ru',
        'x-default': 'https://free-dev-tools.net.tr/en',
      },
    },
    // Google Site Verification
    verification: {
      google: 'JTl7ocUCsAiICDbWUYpv8B3wfSKQSdRLdg1tPXDDTac',
    },
    // Google AdSense Account
    other: {
      'google-adsense-account': 'ca-pub-9339461513261360',
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider messages={messages}>
            <LoadingProvider>
              <NavigationListener />
              <GlobalLoading />
              <div className="flex min-h-screen flex-col">
                <Header locale={locale as Locale} />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
              <CookieConsent />
            </LoadingProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

