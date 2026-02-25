import { getRequestConfig } from 'next-intl/server';
import { hasLocale } from 'next-intl';

export const locales = ['en', 'de', 'tr', 'fr', 'pt', 'es', 'it', 'nl', 'ja', 'ru'] as const;
export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(locales, requested) ? requested : 'en';

  return {
    locale,
    messages: (await import(`./locales/${locale}.json`)).default,
  };
});
