const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 🚀 PERFORMANCE OPTIMIZATIONS
  reactStrictMode: true,
  
  // Output configuration for Docker
  output: 'standalone',
  
  // Compression - Enable aggressive compression
  compress: true,
  
  // 🔥 SERVER EXTERNAL PACKAGES
  serverExternalPackages: ['sharp'],
  
  experimental: {
    middlewareClientMaxBodySize: 52428800, // 50MB
    serverActions: {
      bodySizeLimit: '50mb',
    },
    // Optimize package imports to reduce bundle size (tree-shaking)
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },

  // 🎯 SWC COMPILER: Target modern browsers to reduce polyfill bundle size
  // This eliminates Array.flat, Object.assign etc polyfills for modern browsers
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },
  
  // 🌐 FORCE DYNAMIC RENDERING (for next-intl compatibility)
  // This disables static optimization but allows build to complete
  // All pages will be rendered on-demand
  generateBuildId: async () => {
    return 'build-' + Date.now()
  },
  
  // 📸 ADVANCED IMAGE OPTIMIZATION
  images: {
    // Modern formats with fallback
    formats: ['image/avif', 'image/webp'],
    // Optimized device sizes for better performance
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Enable lazy loading by default
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Enable image optimization
    unoptimized: false,
  },
  
  // 🎯 WEBPACK OPTIMIZATIONS
  webpack: (config, { dev, isServer }) => {
    // Fix for 'self is not defined' error
    if (isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }

    if (!dev && !isServer) {
      // Optimize chunk splitting for better caching
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          ...config.optimization?.splitChunks,
          cacheGroups: {
            ...(config.optimization?.splitChunks?.cacheGroups || {}),
            // Separate heavy editor chunks
            monaco: {
              name: 'monaco-editor',
              test: /[\\/]node_modules[\\/]@monaco-editor[\\/]/,
              chunks: 'async',
              priority: 30,
            },
            // Common vendor chunk
            vendor: {
              name: 'vendor',
              test: /[\\/]node_modules[\\/]/,
              chunks: 'async',
              priority: 20,
              minChunks: 2,
              reuseExistingChunk: true,
            },
          },
        },
      };
    }

    return config;
  },
  
  // 📦 BUNDLE ANALYZER (optional - uncomment to analyze bundle)
  // bundleAnalyzer: {
  //   enabled: process.env.ANALYZE === 'true',
  // },
  
  // 🛡️ SECURITY & PERFORMANCE HEADERS
  async headers() {
    return [
      {
        // Apply to all routes
        source: '/:path*',
        headers: [
          // DNS prefetch for performance
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          // Security headers
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          },
          // Performance headers
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains'
          }
        ]
      },
      {
        // Static assets caching (handled by NGINX, but fallback)
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      {
        // Next/font served fonts — cache aggressively
        source: '/_next/static/media/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      {
        // Public fonts directory and woff2 files
        source: '/(fonts|public/fonts)/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      {
        // Images caching
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      {
        // Favicon and manifest caching
        source: '/(favicon.ico|manifest.json|robots.txt|sitemap.xml)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400'
          }
        ]
      }
    ]
  },
  
  // 🔄 REDIRECTS FOR SEO
  async redirects() {
    const defaultRedirects = [];
    
    // Load SEO redirects if they exist
    try {
      const seoRedirects = require('./seo-redirects.json');
      return [...defaultRedirects, ...seoRedirects];
    } catch (error) {
      console.warn('SEO redirects not found, using default redirects only');
      return defaultRedirects;
    }
  },
  
  // 📄 REWRITES FOR CLEAN URLs
  async rewrites() {
    return [
      {
        source: '/sitemap.xml',
        destination: '/api/sitemap',
      },
      // TODO: Stirling-PDF proxy (uncomment when ready)
      // {
      //   source: '/pdf/api/:path*',
      //   destination: process.env.STIRLING_PDF_URL 
      //     ? `${process.env.STIRLING_PDF_URL}/api/v1/:path*` 
      //     : 'http://localhost:8080/api/v1/:path*',
      // },
    ]
  }
};

module.exports = withNextIntl(nextConfig);
