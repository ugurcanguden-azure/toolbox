#!/usr/bin/env tsx

/**
 * SEO Data Collection Script
 * Crawls the site and collects SEO data for analysis
 */

import fs from 'fs';
import path from 'path';
import { createWriteStream } from 'fs';
import { parse } from 'csv-parse';
import { stringify } from 'csv-stringify';

interface CrawlData {
  url: string;
  finalUrl: string;
  status: number;
  title: string;
  h1Count: number;
  canonical: string;
  robots: string;
  contentLength: number;
  internalLinks: number;
  externalLinks: number;
  hasMetaDescription: boolean;
  metaDescription: string;
  lastModified: string;
}

class SEOCrawler {
  private baseUrl: string;
  private outputDir: string;
  private crawlData: CrawlData[] = [];
  private visitedUrls = new Set<string>();

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.outputDir = path.join(process.cwd(), 'seo-output');
    
    // Ensure output directory exists
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  async collect() {
    console.log('🚀 Starting SEO data collection...');
    
    try {
      // Parse sitemap to get initial URLs
      const sitemapUrls = await this.parseSitemap();
      console.log(`📄 Found ${sitemapUrls.length} URLs in sitemap`);
      
      // Crawl each URL
      for (const url of sitemapUrls) {
        if (this.visitedUrls.has(url)) continue;
        
        console.log(`🔍 Crawling: ${url}`);
        await this.crawlUrl(url);
        
        // Add delay to be respectful
        await this.delay(100);
      }
      
      // Save crawl data
      await this.saveCrawlData();
      
      console.log(`✅ Collection complete! Found ${this.crawlData.length} pages`);
      
    } catch (error) {
      console.error('❌ Error during collection:', error);
      process.exit(1);
    }
  }

  private async parseSitemap(): Promise<string[]> {
    const sitemapUrl = `${this.baseUrl}/sitemap.xml`;
    
    try {
      const response = await fetch(sitemapUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch sitemap: ${response.status}`);
      }
      
      const xml = await response.text();
      const urls: string[] = [];
      
      // Simple XML parsing for URLs
      const urlMatches = xml.match(/<loc>(.*?)<\/loc>/g);
      if (urlMatches) {
        urlMatches.forEach(match => {
          const url = match.replace(/<\/?loc>/g, '');
          urls.push(url);
        });
      }
      
      return urls;
    } catch (error) {
      console.warn(`⚠️ Could not parse sitemap: ${error}`);
      // Fallback: return basic URLs
      return [
        this.baseUrl,
        `${this.baseUrl}/en`,
        `${this.baseUrl}/de`,
        `${this.baseUrl}/tr`,
        `${this.baseUrl}/fr`,
        `${this.baseUrl}/pt`,
      ];
    }
  }

  private async crawlUrl(url: string): Promise<void> {
    this.visitedUrls.add(url);
    
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'SEO-Crawler/1.0',
        },
      });
      
      const finalUrl = response.url;
      const status = response.status;
      
      if (status >= 400) {
        this.crawlData.push({
          url,
          finalUrl,
          status,
          title: '',
          h1Count: 0,
          canonical: '',
          robots: '',
          contentLength: 0,
          internalLinks: 0,
          externalLinks: 0,
          hasMetaDescription: false,
          metaDescription: '',
          lastModified: new Date().toISOString(),
        });
        return;
      }
      
      const html = await response.text();
      const crawlData = this.parseHtml(html, url, finalUrl, status);
      this.crawlData.push(crawlData);
      
    } catch (error) {
      console.warn(`⚠️ Error crawling ${url}:`, error);
      this.crawlData.push({
        url,
        finalUrl: url,
        status: 0,
        title: '',
        h1Count: 0,
        canonical: '',
        robots: '',
        contentLength: 0,
        internalLinks: 0,
        externalLinks: 0,
        hasMetaDescription: false,
        metaDescription: '',
        lastModified: new Date().toISOString(),
      });
    }
  }

  private parseHtml(html: string, originalUrl: string, finalUrl: string, status: number): CrawlData {
    // Extract title
    const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : '';
    
    // Count H1 tags
    const h1Matches = html.match(/<h1[^>]*>/gi);
    const h1Count = h1Matches ? h1Matches.length : 0;
    
    // Extract canonical URL
    const canonicalMatch = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["'][^>]*>/i);
    const canonical = canonicalMatch ? canonicalMatch[1] : '';
    
    // Extract robots meta
    const robotsMatch = html.match(/<meta[^>]*name=["']robots["'][^>]*content=["']([^"']*)["'][^>]*>/i);
    const robots = robotsMatch ? robotsMatch[1] : '';
    
    // Extract meta description
    const descriptionMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/i);
    const metaDescription = descriptionMatch ? descriptionMatch[1] : '';
    
    // Count internal/external links
    const linkMatches = html.match(/<a[^>]*href=["']([^"']*)["'][^>]*>/gi);
    let internalLinks = 0;
    let externalLinks = 0;
    
    if (linkMatches) {
      linkMatches.forEach(match => {
        const hrefMatch = match.match(/href=["']([^"']*)["']/i);
        if (hrefMatch) {
          const href = hrefMatch[1];
          if (href.startsWith('http')) {
            if (href.includes(this.baseUrl)) {
              internalLinks++;
            } else {
              externalLinks++;
            }
          } else if (href.startsWith('/')) {
            internalLinks++;
          }
        }
      });
    }
    
    return {
      url: originalUrl,
      finalUrl,
      status,
      title,
      h1Count,
      canonical,
      robots,
      contentLength: html.length,
      internalLinks,
      externalLinks,
      hasMetaDescription: !!metaDescription,
      metaDescription,
      lastModified: new Date().toISOString(),
    };
  }

  private async saveCrawlData(): Promise<void> {
    const csvPath = path.join(this.outputDir, 'crawl.csv');
    
    const stringifier = stringify({
      header: true,
      columns: [
        'url', 'finalUrl', 'status', 'title', 'h1Count', 'canonical', 
        'robots', 'contentLength', 'internalLinks', 'externalLinks',
        'hasMetaDescription', 'metaDescription', 'lastModified'
      ]
    });
    
    const writeStream = createWriteStream(csvPath);
    stringifier.pipe(writeStream);
    
    for (const data of this.crawlData) {
      stringifier.write(data);
    }
    
    stringifier.end();
    
    console.log(`💾 Crawl data saved to: ${csvPath}`);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Main execution
async function main() {
  const baseUrl = process.env.SITE_URL || 'https://toolbox.curioboxapp.info/';
  
  if (!baseUrl) {
    console.error('❌ SITE_URL environment variable is required');
    process.exit(1);
  }
  
  const crawler = new SEOCrawler(baseUrl);
  await crawler.collect();
}

if (require.main === module) {
  main().catch(console.error);
}

export { SEOCrawler };
