import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Toaster } from 'sonner';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { ThemeProvider, Header, Footer, CookieConsent, GlobalLoading, NavigationListener, SmartRedirectListener } from '@/components/layout';
import { SidebarClient } from '@/components/layout/sidebar-client';
import { GoogleAnalytics } from '@/components/analytics/google-analytics';
import { LoadingProvider } from '@/contexts';
import { locales, type Locale } from '@/i18n/request';
import '@/styles/globals.css';
import type { Metadata } from 'next';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-plus-jakarta-sans',
  fallback: ['system-ui', 'Arial', 'sans-serif'],
  adjustFontFallback: true,
});

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
    metadataBase: new URL('https://toolbox.curioboxapp.info'),
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
      images: [
        {
          url: 'https://toolbox.curioboxapp.info/og-image.svg',
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
      images: ['https://toolbox.curioboxapp.info/og-image.svg'],
    },
     // Google Site Verification
    verification: {
      google: 'bIxfo-zqtnjZmEcwbIgclHMqLIo8C6RdmYeeiLEIZJ4',
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
  const publicRuntimeEnv = {
    NEXT_PUBLIC_GA_MEASUREMENT_ID:
      process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || process.env.NEXT_PUBLIC_GA_ID || '',
    NEXT_PUBLIC_GA_ID: process.env.NEXT_PUBLIC_GA_ID || '',
    NEXT_PUBLIC_GTM_ID: process.env.NEXT_PUBLIC_GTM_ID || '',
  };

  return (
    <html lang={locale} suppressHydrationWarning className={plusJakartaSans.variable}>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <meta name="google-adsense-account" content="ca-pub-9339461513261360" />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.__APP_PUBLIC_ENV = ${JSON.stringify(publicRuntimeEnv)};`,
          }}
        />
      </head>
      <body className="font-sans antialiased min-h-screen">
        <GoogleAnalytics />
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
              <div className="flex h-screen flex-col overflow-hidden">
                <Header locale={locale as Locale} />
                <div className="flex flex-col lg:flex-row flex-1 min-h-0 overflow-hidden">
                  <SidebarClient locale={locale} />
                  <main className="flex-1 h-full overflow-y-auto w-full">{children}</main>
                </div>
                <Footer />
              </div>
              <CookieConsent />
              <SmartRedirectListener locale={locale} />
              <Toaster />
            </LoadingProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
