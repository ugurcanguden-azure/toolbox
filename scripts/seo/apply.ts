#!/usr/bin/env tsx

/**
 * SEO Apply Script
 * Applies SEO fixes based on diagnostic results
 */

import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse';

interface RedirectRule {
  source: string;
  destination: string;
  permanent: boolean;
}

interface NoIndexRule {
  pattern: string;
  reason: string;
}

class SEOApplier {
  private outputDir: string;
  private projectRoot: string;

  constructor() {
    this.outputDir = path.join(process.cwd(), 'seo-output');
    this.projectRoot = process.cwd();
  }

  async apply() {
    console.log('🔧 Starting SEO fixes application...');
    
    try {
      // Load diagnostic results
      const results = await this.loadDiagnosticResults();
      
      // Apply redirects
      await this.applyRedirects(results.redirects);
      
      // Apply noindex rules
      await this.applyNoIndexRules(results.discoveredNotIndexed);
      
      // Update next.config.js
      await this.updateNextConfig();
      
      // Update middleware
      await this.updateMiddleware();
      
      // Generate sitemap config
      await this.generateSitemapConfig();
      
      console.log('✅ SEO fixes applied successfully!');
      
    } catch (error) {
      console.error('❌ Error applying SEO fixes:', error);
      process.exit(1);
    }
  }

  private async loadDiagnosticResults() {
    const results = {
      redirects: [] as any[],
      discoveredNotIndexed: [] as any[],
      duplicateCanonical: [] as any[]
    };

    // Load redirect data
    const redirectPath = path.join(this.outputDir, 'redirect.csv');
    if (fs.existsSync(redirectPath)) {
      results.redirects = await this.parseCSV(redirectPath);
    }

    // Load discovered not indexed data
    const discoveredPath = path.join(this.outputDir, 'discovered-not-indexed.csv');
    if (fs.existsSync(discoveredPath)) {
      results.discoveredNotIndexed = await this.parseCSV(discoveredPath);
    }

    // Load duplicate canonical data
    const duplicatePath = path.join(this.outputDir, 'duplicate-canonical.csv');
    if (fs.existsSync(duplicatePath)) {
      results.duplicateCanonical = await this.parseCSV(duplicatePath);
    }

    return results;
  }

  private async parseCSV(filePath: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const records: any[] = [];
      
      fs.createReadStream(filePath)
        .pipe(parse({ 
          columns: true,
          skip_empty_lines: true 
        }))
        .on('data', (record) => records.push(record))
        .on('end', () => resolve(records))
        .on('error', reject);
    });
  }

  private async applyRedirects(redirects: any[]): Promise<void> {
    console.log(`🔄 Processing ${redirects.length} redirects...`);
    
    const redirectRules: RedirectRule[] = [];
    
    redirects.forEach(redirect => {
      if (redirect.status >= 300 && redirect.status < 400) {
        redirectRules.push({
          source: redirect.url,
          destination: redirect.finalUrl,
          permanent: redirect.status === 301
        });
      }
    });

    // Save redirect rules to JSON
    const redirectsPath = path.join(this.projectRoot, 'seo-redirects.json');
    fs.writeFileSync(redirectsPath, JSON.stringify(redirectRules, null, 2));
    
    console.log(`💾 Saved ${redirectRules.length} redirect rules to seo-redirects.json`);
  }

  private async applyNoIndexRules(discoveredNotIndexed: any[]): Promise<void> {
    console.log(`🚫 Processing ${discoveredNotIndexed.length} noindex candidates...`);
    
    const noIndexRules: NoIndexRule[] = [];
    
    discoveredNotIndexed.forEach(item => {
      // Identify patterns for noindex
      if (item.url.includes('?') || item.url.includes('#')) {
        noIndexRules.push({
          pattern: item.url,
          reason: 'Parameterized URL'
        });
      }
      
      if (item.contentLength < 500) {
        noIndexRules.push({
          pattern: item.url,
          reason: 'Thin content'
        });
      }
      
      if (!item.title || item.title.length < 10) {
        noIndexRules.push({
          pattern: item.url,
          reason: 'Missing or short title'
        });
      }
    });

    // Save noindex rules to JSON
    const noIndexPath = path.join(this.projectRoot, 'seo-noindex-routes.json');
    fs.writeFileSync(noIndexPath, JSON.stringify(noIndexRules, null, 2));
    
    console.log(`💾 Saved ${noIndexRules.length} noindex rules to seo-noindex-routes.json`);
  }

  private async updateNextConfig(): Promise<void> {
    console.log('⚙️ Updating next.config.js...');
    
    const configPath = path.join(this.projectRoot, 'next.config.js');
    let configContent = fs.readFileSync(configPath, 'utf8');
    
    // Add redirects import and configuration
    const redirectsConfig = `
  // 🔄 SEO REDIRECTS
  async redirects() {
    const seoRedirects = require('./seo-redirects.json');
    const defaultRedirects = [
      {
        source: '/',
        destination: '/en',
        permanent: true,
      },
    ];
    
    return [...defaultRedirects, ...seoRedirects];
  },`;
    
    // Check if redirects already exist
    if (!configContent.includes('async redirects()')) {
      // Insert redirects before the closing bracket
      configContent = configContent.replace(
        /(\s+)(async rewrites\(\) {[\s\S]*?}\s+})(\s*};)/,
        `$1$2$1${redirectsConfig}$3`
      );
    }
    
    fs.writeFileSync(configPath, configContent);
    console.log('✅ Updated next.config.js with redirects');
  }

  private async updateMiddleware(): Promise<void> {
    console.log('🛡️ Updating middleware.ts...');
    
    const middlewarePath = path.join(this.projectRoot, 'middleware.ts');
    let middlewareContent = fs.readFileSync(middlewarePath, 'utf8');
    
    // Add URL normalization middleware
    const normalizationMiddleware = `
import { NextRequest, NextResponse } from 'next/server';

// URL Normalization Middleware
function normalizeUrl(request: NextRequest): NextResponse | null {
  const url = request.nextUrl.clone();
  const { pathname, search, hash } = url;
  
  // Force HTTPS
  if (process.env.NODE_ENV === 'production' && request.headers.get('x-forwarded-proto') !== 'https') {
    url.protocol = 'https:';
    return NextResponse.redirect(url, 301);
  }
  
  // Normalize trailing slash
  const shouldHaveTrailingSlash = pathname !== '/' && !pathname.includes('.') && !pathname.endsWith('/');
  if (shouldHaveTrailingSlash) {
    url.pathname = pathname + '/';
    return NextResponse.redirect(url, 301);
  }
  
  // Normalize case (optional - can be aggressive)
  const normalizedPathname = pathname.toLowerCase();
  if (pathname !== normalizedPathname) {
    url.pathname = normalizedPathname;
    return NextResponse.redirect(url, 301);
  }
  
  return null;
}

// Enhanced middleware
export function middleware(request: NextRequest) {
  // Apply URL normalization
  const normalizedResponse = normalizeUrl(request);
  if (normalizedResponse) {
    return normalizedResponse;
  }
  
  // Apply existing next-intl middleware
  return createMiddleware({
    locales,
    defaultLocale: 'en',
    localePrefix: 'always'
  })(request);
}`;
    
    // Update the middleware content
    const updatedContent = middlewareContent.replace(
      "import createMiddleware from 'next-intl/middleware';\nimport { locales } from './i18n/request';\n\nexport default createMiddleware({\n  locales,\n  defaultLocale: 'en',\n  localePrefix: 'always'\n});\n\nexport const config = {\n  matcher: ['/', '/(de|en|tr|fr|pt|es|it|nl|ja|ru)/:path*']\n};",
      normalizationMiddleware
    );
    
    fs.writeFileSync(middlewarePath, updatedContent);
    console.log('✅ Updated middleware.ts with URL normalization');
  }

  private async generateSitemapConfig(): Promise<void> {
    console.log('🗺️ Generating sitemap configuration...');
    
    const sitemapConfig = `const { getServerSideSitemap } = require('next-sitemap');

const SITE_URL = process.env.SITE_URL || 'https://toolbox.curioboxapp.info/';

module.exports = {
  siteUrl: SITE_URL,
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  exclude: [
    '/admin/*',
    '/preview/*',
    '/api/*',
    '/_next/*',
    '/404',
    '/500'
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/preview/', '/api/']
      }
    ],
    additionalSitemaps: [
      \`\${SITE_URL}/sitemap.xml\`
    ]
  },
  transform: async (config, path) => {
    // Custom transform for different page types
    const priority = path === '/' ? 1.0 : 
                   path.includes('/tools/') ? 0.8 : 
                   path.includes('/blog/') ? 0.6 : 0.5;
    
    const changefreq = path === '/' ? 'daily' : 
                       path.includes('/tools/') ? 'weekly' : 
                       path.includes('/blog/') ? 'monthly' : 'yearly';
    
    return {
      loc: path,
      lastmod: new Date().toISOString(),
      changefreq,
      priority,
      alternateRefs: [
        {
          href: \`\${SITE_URL}/en\${path.replace(/^\/[a-z]{2}/, '')}\`,
          hreflang: 'en'
        },
        {
          href: \`\${SITE_URL}/de\${path.replace(/^\/[a-z]{2}/, '')}\`,
          hreflang: 'de'
        },
        {
          href: \`\${SITE_URL}/tr\${path.replace(/^\/[a-z]{2}/, '')}\`,
          hreflang: 'tr'
        },
        {
          href: \`\${SITE_URL}/fr\${path.replace(/^\/[a-z]{2}/, '')}\`,
          hreflang: 'fr'
        },
        {
          href: \`\${SITE_URL}/pt\${path.replace(/^\/[a-z]{2}/, '')}\`,
          hreflang: 'pt'
        }
      ]
    };
  }
};`;
    
    const sitemapConfigPath = path.join(this.projectRoot, 'next-sitemap.config.js');
    fs.writeFileSync(sitemapConfigPath, sitemapConfig);
    
    console.log('✅ Generated next-sitemap.config.js');
  }
}

// Main execution
async function main() {
  const applier = new SEOApplier();
  await applier.apply();
}

if (require.main === module) {
  main().catch(console.error);
}

export { SEOApplier };
