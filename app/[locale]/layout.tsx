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

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ 
  params: { locale } 
}: { 
  params: { locale: string } 
}): Promise<Metadata> {
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
      url: `https://toolbox.curioboxapp.info/${locale}`,
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
    alternates: {
      canonical: `https://toolbox.curioboxapp.info/${locale}`,
      languages: {
        'en': 'https://toolbox.curioboxapp.info/en',
        'de': 'https://toolbox.curioboxapp.info/de',
        'tr': 'https://toolbox.curioboxapp.info/tr',
        'fr': 'https://toolbox.curioboxapp.info/fr',
        'pt': 'https://toolbox.curioboxapp.info/pt',
        'es': 'https://toolbox.curioboxapp.info/es',
        'it': 'https://toolbox.curioboxapp.info/it',
        'nl': 'https://toolbox.curioboxapp.info/nl',
        'ja': 'https://toolbox.curioboxapp.info/ja',
        'ru': 'https://toolbox.curioboxapp.info/ru',
        'x-default': 'https://toolbox.curioboxapp.info/en',
      },
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
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
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

