import { MetadataRoute } from 'next';
import { locales } from '@/i18n/request';

const baseUrl = 'https://toolbox.curioboxapp.info';

const tools = [
  'json-formatter',
  'xml-formatter',
  'base64',
  'url-encoder',
  'uuid-generator',
  'password-generator',
  'hash-generator',
  'color-converter',
  'qr-generator',
  'regex-tester',
  'string-tools',
  'markdown-preview',
  'jwt-decoder',
  'timestamp-converter',
  'lorem-generator',
  'case-converter',
  'html-formatter',
  'css-minifier',
  'sql-formatter',
  'image-to-base64',
  'number-base-converter',
  'word-counter',
  'line-sorter',
  'duplicate-remover',
  'html-entity-encoder',
  'json-to-csv',
  'csv-to-json',
  'yaml-formatter',
  'credit-card-validator',
  'text-compare',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: MetadataRoute.Sitemap = [];
  const currentDate = new Date();

  // Add root redirect
  routes.push({
    url: baseUrl,
    lastModified: currentDate,
    changeFrequency: 'daily',
    priority: 1,
  });

  // Add homepage for each locale
  locales.forEach((locale) => {
    routes.push({
      url: `${baseUrl}/${locale}`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l, `${baseUrl}/${l}`])
        ),
      },
    });
  });

  // Define tool categories with priorities
  const highPriorityTools = [
    'json-formatter',
    'base64',
    'uuid-generator',
    'password-generator',
    'hash-generator',
    'qr-generator',
    'color-converter',
    'regex-tester',
  ];

  // Add tool pages for each locale
  tools.forEach((tool) => {
    const isHighPriority = highPriorityTools.includes(tool);
    locales.forEach((locale) => {
      routes.push({
        url: `${baseUrl}/${locale}/tools/${tool}`,
        lastModified: currentDate,
        changeFrequency: isHighPriority ? 'weekly' : 'monthly',
        priority: isHighPriority ? 0.9 : 0.7,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [l, `${baseUrl}/${l}/tools/${tool}`])
          ),
        },
      });
    });
  });

  // Add privacy policy for each locale
  locales.forEach((locale) => {
    routes.push({
      url: `${baseUrl}/${locale}/privacy-policy`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.3,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l, `${baseUrl}/${l}/privacy-policy`])
        ),
      },
    });
  });

  return routes;
}
