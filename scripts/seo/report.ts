#!/usr/bin/env tsx

/**
 * SEO Report Generator
 * Generates comprehensive SEO summary report
 */

import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse';

interface ReportData {
  totalPages: number;
  issues: {
    altWithCanonical: number;
    notFound404: number;
    redirects: number;
    discoveredNotIndexed: number;
    crawledNotIndexed: number;
    duplicateCanonical: number;
  };
  fixes: {
    redirectsApplied: number;
    noIndexRulesApplied: number;
    canonicalFixes: number;
  };
}

class SEOReporter {
  private outputDir: string;
  private projectRoot: string;

  constructor() {
    this.outputDir = path.join(process.cwd(), 'seo-output');
    this.projectRoot = process.cwd();
  }

  async generateReport() {
    console.log('📊 Generating SEO summary report...');
    
    try {
      // Load all diagnostic data
      const reportData = await this.loadReportData();
      
      // Generate markdown report
      const report = this.generateMarkdownReport(reportData);
      
      // Save report
      const reportPath = path.join(this.outputDir, 'seo-summary.md');
      fs.writeFileSync(reportPath, report);
      
      console.log(`✅ SEO summary report generated: ${reportPath}`);
      
    } catch (error) {
      console.error('❌ Error generating report:', error);
      process.exit(1);
    }
  }

  private async loadReportData(): Promise<ReportData> {
    const data: ReportData = {
      totalPages: 0,
      issues: {
        altWithCanonical: 0,
        notFound404: 0,
        redirects: 0,
        discoveredNotIndexed: 0,
        crawledNotIndexed: 0,
        duplicateCanonical: 0
      },
      fixes: {
        redirectsApplied: 0,
        noIndexRulesApplied: 0,
        canonicalFixes: 0
      }
    };

    // Load crawl data for total pages
    const crawlPath = path.join(this.outputDir, 'crawl.csv');
    if (fs.existsSync(crawlPath)) {
      const crawlData = await this.parseCSV(crawlPath);
      data.totalPages = crawlData.length;
    }

    // Load diagnostic results
    const diagnosticFiles = [
      'alt-with-canonical.csv',
      '404.csv',
      'redirect.csv',
      'discovered-not-indexed.csv',
      'crawled-not-indexed.csv',
      'duplicate-canonical.csv'
    ];

    for (const file of diagnosticFiles) {
      const filePath = path.join(this.outputDir, file);
      if (fs.existsSync(filePath)) {
        const fileData = await this.parseCSV(filePath);
        const count = fileData.length;
        
        switch (file) {
          case 'alt-with-canonical.csv':
            data.issues.altWithCanonical = count;
            break;
          case '404.csv':
            data.issues.notFound404 = count;
            break;
          case 'redirect.csv':
            data.issues.redirects = count;
            break;
          case 'discovered-not-indexed.csv':
            data.issues.discoveredNotIndexed = count;
            break;
          case 'crawled-not-indexed.csv':
            data.issues.crawledNotIndexed = count;
            break;
          case 'duplicate-canonical.csv':
            data.issues.duplicateCanonical = count;
            break;
        }
      }
    }

    // Load applied fixes
    const redirectsPath = path.join(this.projectRoot, 'seo-redirects.json');
    if (fs.existsSync(redirectsPath)) {
      const redirects = JSON.parse(fs.readFileSync(redirectsPath, 'utf8'));
      data.fixes.redirectsApplied = redirects.length;
    }

    const noIndexPath = path.join(this.projectRoot, 'seo-noindex-routes.json');
    if (fs.existsSync(noIndexPath)) {
      const noIndexRules = JSON.parse(fs.readFileSync(noIndexPath, 'utf8'));
      data.fixes.noIndexRulesApplied = noIndexRules.length;
    }

    return data;
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

  private generateMarkdownReport(data: ReportData): string {
    const timestamp = new Date().toISOString();
    const siteUrl = process.env.SITE_URL || 'https://toolbox.curioboxapp.info/';
    
    return `# SEO Optimization Summary Report

**Generated:** ${timestamp}  
**Site:** ${siteUrl}  
**Total Pages Analyzed:** ${data.totalPages}

## 📊 Issues Found

### 1. Doğru standart etikete sahip alternatif sayfa
- **Count:** ${data.issues.altWithCanonical}
- **Description:** Pages with canonical URLs pointing to different pages
- **Impact:** Can cause duplicate content issues
- **Fix Applied:** Self-canonical implementation

### 2. Bulunamadı (404)
- **Count:** ${data.issues.notFound404}
- **Description:** Pages returning 404 status
- **Impact:** Poor user experience, lost link equity
- **Fix Applied:** ${data.fixes.redirectsApplied} redirect rules created

### 3. Yönlendirmeli sayfa
- **Count:** ${data.issues.redirects}
- **Description:** Pages with 3xx redirect status
- **Impact:** Redirect chains can slow down crawling
- **Fix Applied:** Redirect optimization

### 4. Keşfedildi – şu anda dizine eklenmiş değil
- **Count:** ${data.issues.discoveredNotIndexed}
- **Description:** Pages with thin content or missing SEO elements
- **Impact:** Low indexing priority
- **Fix Applied:** ${data.fixes.noIndexRulesApplied} noindex rules applied

### 5. Tarandı – şu anda dizine eklenmiş değil
- **Count:** ${data.issues.crawledNotIndexed}
- **Description:** Pages crawled but not indexed
- **Impact:** Content not appearing in search results
- **Fix Applied:** Content optimization and internal linking

### 6. Kopya, Google kullanıcısından farklı bir standart sayfa seçti
- **Count:** ${data.issues.duplicateCanonical}
- **Description:** Multiple URLs with same canonical
- **Impact:** Confusion about preferred URL
- **Fix Applied:** Canonical consolidation

## 🔧 Applied Fixes

### Redirects
- **Applied:** ${data.fixes.redirectsApplied} redirect rules
- **File:** \`seo-redirects.json\`
- **Integration:** \`next.config.js\`

### NoIndex Rules
- **Applied:** ${data.fixes.noIndexRulesApplied} noindex rules
- **File:** \`seo-noindex-routes.json\`
- **Integration:** Page-level metadata

### Canonical Fixes
- **Applied:** ${data.fixes.canonicalFixes} canonical fixes
- **Implementation:** Self-canonical for all pages

## 🛠️ Technical Implementation

### Files Created/Modified
- \`next.config.js\` - Added redirects configuration
- \`middleware.ts\` - Added URL normalization
- \`next-sitemap.config.js\` - Generated sitemap configuration
- \`seo-redirects.json\` - Redirect rules
- \`seo-noindex-routes.json\` - NoIndex rules

### Scripts Added
- \`scripts/seo/collect.ts\` - Data collection
- \`scripts/seo/diagnose.ts\` - Issue diagnosis
- \`scripts/seo/apply.ts\` - Fix application
- \`scripts/seo/report.ts\` - Report generation

## 🎯 Expected GSC Impact

### Short Term (1-2 weeks)
- Reduced 404 errors
- Improved crawl efficiency
- Better URL structure

### Medium Term (2-4 weeks)
- Increased indexing rate
- Reduced duplicate content issues
- Better user experience signals

### Long Term (1-3 months)
- Improved search rankings
- Better content discoverability
- Enhanced site authority

## 🔍 GSC Verification Steps

### 1. URL Inspection
Test the following URLs in GSC URL Inspection tool:

#### Test URLs for Verification:
- **Homepage:** ${siteUrl}/en
- **Tools:** ${siteUrl}/en/tools/json-formatter
- **Redirects:** Check old URLs redirect properly
- **Canonical:** Verify self-canonical implementation

#### Expected Results:
- ✅ 200 status code
- ✅ Self-canonical URL
- ✅ Proper meta tags
- ✅ No redirect chains

### 2. Sitemap Verification
- **Sitemap URL:** ${siteUrl}/sitemap.xml
- **Robots.txt:** ${siteUrl}/robots.txt
- **Verification:** Submit sitemap in GSC

### 3. Coverage Report Monitoring
Monitor GSC Coverage report for:
- Valid pages increase
- 404 errors decrease
- Redirect issues resolved
- Indexing improvements

### 4. Performance Monitoring
- **Core Web Vitals:** Monitor LCP, FID, CLS
- **Page Experience:** Check mobile usability
- **Speed:** Monitor page load times

## 📅 Follow-up Schedule

### Week 1
- [ ] Deploy changes to production
- [ ] Submit updated sitemap to GSC
- [ ] Test URL inspection for key pages
- [ ] Monitor initial indexing changes

### Week 2
- [ ] Check GSC Coverage report
- [ ] Verify redirect chains are resolved
- [ ] Monitor 404 error reduction
- [ ] Test canonical implementation

### Week 4
- [ ] Full GSC analysis
- [ ] Performance metrics review
- [ ] Search ranking impact assessment
- [ ] Plan additional optimizations

## 🚀 Next Steps

1. **Deploy to Production**
   - Ensure all redirects work correctly
   - Verify sitemap generation
   - Test canonical implementation

2. **GSC Submission**
   - Submit updated sitemap
   - Request re-indexing for key pages
   - Monitor coverage improvements

3. **Performance Monitoring**
   - Set up GSC alerts
   - Monitor Core Web Vitals
   - Track indexing progress

4. **Content Optimization**
   - Improve thin content pages
   - Enhance internal linking
   - Optimize meta descriptions

## 📞 Support

For questions about this SEO optimization:
- **Repository:** [GitHub Repository]
- **Documentation:** [Project Documentation]
- **Issues:** [GitHub Issues]

---

*This report was automatically generated by the SEO optimization system.*
`;
  }
}

// Main execution
async function main() {
  const reporter = new SEOReporter();
  await reporter.generateReport();
}

if (require.main === module) {
  main().catch(console.error);
}

export { SEOReporter };
