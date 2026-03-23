const { getServerSideSitemap } = require('next-sitemap');

const SITE_URL = process.env.SITE_URL || 'https://toolbox.curioboxapp.info';

module.exports = {
  siteUrl: SITE_URL,
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  exclude: ['/admin/*', '/preview/*', '/api/*', '/_next/*', '/404', '/500', '/seo-output/*'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/preview/', '/api/', '/seo-output/'],
      },
    ],
    additionalSitemaps: [`${SITE_URL}/sitemap.xml`],
  },
  transform: async (config, path) => {
    // Custom transform for different page types
    const priority =
      path === '/' ? 1.0 : path.includes('/tools/') ? 0.8 : path.includes('/blog/') ? 0.6 : 0.5;

    const changefreq =
      path === '/'
        ? 'daily'
        : path.includes('/tools/')
          ? 'weekly'
          : path.includes('/blog/')
            ? 'monthly'
            : 'yearly';

    return {
      loc: path,
      lastmod: new Date().toISOString(),
      changefreq,
      priority,
      alternateRefs: [
        {
          href: `${SITE_URL}/en${path.replace(/^\/[a-z]{2}/, '')}`,
          hreflang: 'en',
        },
        {
          href: `${SITE_URL}/de${path.replace(/^\/[a-z]{2}/, '')}`,
          hreflang: 'de',
        },
        {
          href: `${SITE_URL}/tr${path.replace(/^\/[a-z]{2}/, '')}`,
          hreflang: 'tr',
        },
        {
          href: `${SITE_URL}/fr${path.replace(/^\/[a-z]{2}/, '')}`,
          hreflang: 'fr',
        },
        {
          href: `${SITE_URL}/pt${path.replace(/^\/[a-z]{2}/, '')}`,
          hreflang: 'pt',
        },
        {
          href: `${SITE_URL}/es${path.replace(/^\/[a-z]{2}/, '')}`,
          hreflang: 'es',
        },
        {
          href: `${SITE_URL}/it${path.replace(/^\/[a-z]{2}/, '')}`,
          hreflang: 'it',
        },
        {
          href: `${SITE_URL}/nl${path.replace(/^\/[a-z]{2}/, '')}`,
          hreflang: 'nl',
        },
        {
          href: `${SITE_URL}/ja${path.replace(/^\/[a-z]{2}/, '')}`,
          hreflang: 'ja',
        },
        {
          href: `${SITE_URL}/ru${path.replace(/^\/[a-z]{2}/, '')}`,
          hreflang: 'ru',
        },
      ],
    };
  },
};
