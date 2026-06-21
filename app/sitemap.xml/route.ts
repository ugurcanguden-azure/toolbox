import { createSitemapIndexXml, getSitemapIndex, sitemapResponse } from '@/lib/sitemap-data';

export const dynamic = 'force-dynamic';

export function GET(): Response {
  return sitemapResponse(createSitemapIndexXml(getSitemapIndex()));
}
