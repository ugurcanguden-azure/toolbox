import { createUrlSetXml, getPostSitemapEntries, sitemapResponse } from '@/lib/sitemap-data';

export const dynamic = 'force-dynamic';

export function GET(): Response {
  return sitemapResponse(createUrlSetXml(getPostSitemapEntries()));
}
