import { MetadataRoute } from 'next';
import { locales } from '@/i18n/request';

import fs from 'fs';
import path from 'path';

const baseUrl = 'https://free-dev-tools.net.tr';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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

  // Dynamically get tools from the directory
  const toolsDir = path.join(process.cwd(), 'app', '[locale]', 'tools');
  let tools: string[] = [];
  try {
    const entries = fs.readdirSync(toolsDir, { withFileTypes: true });
    tools = entries
      .filter((entry) => entry.isDirectory() && !entry.name.startsWith('[') && !entry.name.startsWith('_'))
      .map((entry) => entry.name);
  } catch (e) {
    console.error('Failed to read tools directory for sitemap:', e);
  }

  // Define high priority tool categories
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
