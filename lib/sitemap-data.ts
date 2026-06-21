import { blogPosts } from '@/data/blog-posts';
import { supportedLanguages } from '@/i18n/request';

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://toolbox.curioboxapp.info'
).replace(/\/$/, '');

const generatedAt = new Date();

export type SitemapEntry = {
  url: string;
  lastModified: Date;
  changeFrequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  priority: number;
};

export type SitemapIndexEntry = {
  url: string;
  lastModified: Date;
};

const weeklyTools = new Set([
  'base64',
  'color-converter',
  'hash-generator',
  'json-formatter',
  'password-generator',
  'qr-generator',
  'regex-tester',
  'uuid-generator',
]);

const toolSlugs = [
  'base64',
  'case-converter',
  'color-converter',
  'credit-card-validator',
  'cron-expression-generator',
  'css-minifier',
  'csv-to-json',
  'duplicate-remover',
  'hash-generator',
  'html-entity-encoder',
  'html-formatter',
  'image-to-base64',
  'json-formatter',
  'json-to-csv',
  'jwt-decoder',
  'line-sorter',
  'lorem-generator',
  'markdown-preview',
  'number-base-converter',
  'password-generator',
  'pdf-merge',
  'pdf-protect',
  'pdf-to-image',
  'pdf-to-word',
  'qr-generator',
  'regex-tester',
  'sql-formatter',
  'string-tools',
  'text-compare',
  'timestamp-converter',
  'url-encoder',
  'uuid-generator',
  'word-counter',
  'xml-formatter',
  'yaml-formatter',
] as const;

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function getSitemapIndex(): SitemapIndexEntry[] {
  return [
    { url: `${siteUrl}/sitemap-pages.xml`, lastModified: generatedAt },
    { url: `${siteUrl}/sitemap-tools.xml`, lastModified: generatedAt },
    { url: `${siteUrl}/sitemap-posts.xml`, lastModified: generatedAt },
  ];
}

export function getPageSitemapEntries(): SitemapEntry[] {
  const entries: SitemapEntry[] = [
    {
      url: siteUrl,
      lastModified: generatedAt,
      changeFrequency: 'daily',
      priority: 1,
    },
  ];

  supportedLanguages.forEach((language) => {
    entries.push(
      {
        url: `${siteUrl}/${language}`,
        lastModified: generatedAt,
        changeFrequency: 'daily',
        priority: 1,
      },
      {
        url: `${siteUrl}/${language}/tools`,
        lastModified: generatedAt,
        changeFrequency: 'weekly',
        priority: 0.8,
      },
      {
        url: `${siteUrl}/${language}/blog`,
        lastModified: generatedAt,
        changeFrequency: 'weekly',
        priority: 0.7,
      },
      {
        url: `${siteUrl}/${language}/about`,
        lastModified: generatedAt,
        changeFrequency: 'monthly',
        priority: 0.5,
      },
      {
        url: `${siteUrl}/${language}/privacy-policy`,
        lastModified: generatedAt,
        changeFrequency: 'yearly',
        priority: 0.3,
      }
    );
  });

  return entries;
}

export function getToolSitemapEntries(): SitemapEntry[] {
  return supportedLanguages.flatMap((language) =>
    toolSlugs.map((slug) => ({
      url: `${siteUrl}/${language}/tools/${slug}`,
      lastModified: generatedAt,
      changeFrequency: weeklyTools.has(slug) ? 'weekly' : 'monthly',
      priority: weeklyTools.has(slug) ? 0.9 : 0.7,
    }))
  );
}

export function getPostSitemapEntries(): SitemapEntry[] {
  return supportedLanguages.flatMap((language) =>
    blogPosts.map((post) => ({
      url: `${siteUrl}/${language}/blog/${post.slug}`,
      lastModified: new Date(`${post.date}T00:00:00.000Z`),
      changeFrequency: 'monthly',
      priority: 0.6,
    }))
  );
}

export function createSitemapIndexXml(entries: SitemapIndexEntry[]): string {
  const sitemaps = entries
    .map(
      (entry) => `  <sitemap>\n    <loc>${escapeXml(entry.url)}</loc>\n    <lastmod>${entry.lastModified.toISOString()}</lastmod>\n  </sitemap>`
    )
    .join('\n');

  return `<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<?xml-stylesheet type=\"text/xsl\" href=\"/sitemap.xsl\"?>\n<sitemapindex xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n${sitemaps}\n</sitemapindex>\n`;
}

export function createUrlSetXml(entries: SitemapEntry[]): string {
  const urls = entries
    .map(
      (entry) => `  <url>\n    <loc>${escapeXml(entry.url)}</loc>\n    <lastmod>${entry.lastModified.toISOString()}</lastmod>\n    <changefreq>${entry.changeFrequency}</changefreq>\n    <priority>${entry.priority.toFixed(1)}</priority>\n  </url>`
    )
    .join('\n');

  return `<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<?xml-stylesheet type=\"text/xsl\" href=\"/sitemap.xsl\"?>\n<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n${urls}\n</urlset>\n`;
}

export function sitemapResponse(xml: string): Response {
  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
