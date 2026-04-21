const SITE_URL = (process.env.SITE_URL || 'https://toolbox.curioboxapp.info').replace(/\/$/, '');

const locales = ['en', 'de', 'tr', 'fr', 'pt', 'es', 'it', 'nl', 'ja', 'ru'];

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
      `${SITE_URL}/sitemap.xml`
    ]
  },
  transform: async (config, path) => {
    const priority = path === '/' ? 1.0 :
                     path.includes('/tools/') ? 0.8 :
                     path.includes('/blog/') ? 0.6 : 0.5;

    const changefreq = path === '/' ? 'daily' :
                       path.includes('/tools/') ? 'weekly' :
                       path.includes('/blog/') ? 'monthly' : 'yearly';

    const cleanPath = path.replace(/^\/[a-z]{2}(\/|$)/, '/');

    return {
      loc: path,
      lastmod: new Date().toISOString(),
      changefreq,
      priority,
      alternateRefs: [
        ...locales.map((lang) => ({
          href: `${SITE_URL}/${lang}${cleanPath === '/' ? '' : cleanPath}`,
          hreflang: lang,
        })),
        {
          href: `${SITE_URL}/en${cleanPath === '/' ? '' : cleanPath}`,
          hreflang: 'x-default',
        },
      ],
    };
  }
};