/**
 * 📦 CACHE CONFIGURATION
 * Defines caching strategies for different asset types
 * Critical for PageSpeed performance optimization
 */

export interface CacheConfig {
  maxAge: number;
  sMaxAge?: number;
  staleWhileRevalidate?: number;
  immutable?: boolean;
  mustRevalidate?: boolean;
  noCache?: boolean;
  noStore?: boolean;
  public?: boolean;
  private?: boolean;
}

/**
 * 🎯 CACHE STRATEGIES
 */
export const CACHE_STRATEGIES = {
  // Static assets - Never change, cache forever
  STATIC_ASSETS: {
    maxAge: 31536000, // 1 year
    immutable: true,
    public: true,
  } as CacheConfig,

  // Images - Cache for 1 year, immutable
  IMAGES: {
    maxAge: 31536000, // 1 year
    immutable: true,
    public: true,
  } as CacheConfig,

  // Fonts - Cache for 1 year, immutable
  FONTS: {
    maxAge: 31536000, // 1 year
    immutable: true,
    public: true,
  } as CacheConfig,

  // HTML pages - Cache for 1 hour, revalidate
  HTML: {
    maxAge: 3600, // 1 hour
    sMaxAge: 86400, // 1 day for CDN
    staleWhileRevalidate: 86400, // 1 day
    mustRevalidate: true,
    public: true,
  } as CacheConfig,

  // API responses - Cache for 5 minutes
  API: {
    maxAge: 300, // 5 minutes
    sMaxAge: 300, // 5 minutes for CDN
    staleWhileRevalidate: 300, // 5 minutes
    mustRevalidate: true,
    public: true,
  } as CacheConfig,

  // JSON data - Cache for 1 hour
  JSON: {
    maxAge: 3600, // 1 hour
    sMaxAge: 3600, // 1 hour for CDN
    staleWhileRevalidate: 3600, // 1 hour
    mustRevalidate: true,
    public: true,
  } as CacheConfig,

  // No cache - For sensitive data
  NO_CACHE: {
    noCache: true,
    noStore: true,
    mustRevalidate: true,
  } as CacheConfig,
} as const;

/**
 * 🛠️ CACHE HEADER BUILDER
 */
export function buildCacheHeaders(config: CacheConfig): Record<string, string> {
  const headers: Record<string, string> = {};

  if (config.noCache) {
    headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
    headers['Pragma'] = 'no-cache';
    headers['Expires'] = '0';
    return headers;
  }

  const directives: string[] = [];

  if (config.public) {
    directives.push('public');
  } else if (config.private) {
    directives.push('private');
  }

  directives.push(`max-age=${config.maxAge}`);

  if (config.sMaxAge) {
    directives.push(`s-maxage=${config.sMaxAge}`);
  }

  if (config.staleWhileRevalidate) {
    directives.push(`stale-while-revalidate=${config.staleWhileRevalidate}`);
  }

  if (config.immutable) {
    directives.push('immutable');
  }

  if (config.mustRevalidate) {
    directives.push('must-revalidate');
  }

  headers['Cache-Control'] = directives.join(', ');

  return headers;
}

/**
 * 📄 ASSET TYPE DETECTOR
 */
export function getAssetType(pathname: string): keyof typeof CACHE_STRATEGIES {
  // Static assets
  if (pathname.startsWith('/_next/static/')) {
    return 'STATIC_ASSETS';
  }

  // Images
  if (/\.(jpg|jpeg|png|gif|svg|webp|avif|ico)$/i.test(pathname)) {
    return 'IMAGES';
  }

  // Fonts
  if (/\.(woff|woff2|ttf|otf|eot)$/i.test(pathname)) {
    return 'FONTS';
  }

  // API routes
  if (pathname.startsWith('/api/')) {
    return 'API';
  }

  // JSON files
  if (pathname.endsWith('.json')) {
    return 'JSON';
  }

  // HTML pages
  return 'HTML';
}

/**
 * 🎯 CACHE HEADER GENERATOR
 */
export function generateCacheHeaders(pathname: string): Record<string, string> {
  const assetType = getAssetType(pathname);
  const strategy = CACHE_STRATEGIES[assetType];
  return buildCacheHeaders(strategy);
}

/**
 * 📊 CACHE STATISTICS
 */
export function getCacheStats(): {
  totalStrategies: number;
  strategies: Array<{
    name: string;
    maxAge: number;
    immutable: boolean;
  }>;
} {
  return {
    totalStrategies: Object.keys(CACHE_STRATEGIES).length,
    strategies: Object.entries(CACHE_STRATEGIES).map(([name, config]) => ({
      name,
      maxAge: config.maxAge,
      immutable: config.immutable || false,
    })),
  };
}

/**
 * 🔄 CACHE VALIDATION
 */
export function validateCacheConfig(config: CacheConfig): boolean {
  // Check for conflicting directives
  if (config.noCache && config.maxAge > 0) {
    return false;
  }

  if (config.immutable && config.mustRevalidate) {
    return false;
  }

  if (config.public && config.private) {
    return false;
  }

  return true;
}

/**
 * 📈 PERFORMANCE METRICS
 */
export function calculateCacheEfficiency(
  hitRate: number,
  missRate: number
): {
  efficiency: number;
  recommendation: string;
} {
  const total = hitRate + missRate;
  const efficiency = total > 0 ? (hitRate / total) * 100 : 0;

  let recommendation = '';
  if (efficiency >= 90) {
    recommendation = 'Excellent cache efficiency';
  } else if (efficiency >= 80) {
    recommendation = 'Good cache efficiency';
  } else if (efficiency >= 70) {
    recommendation = 'Moderate cache efficiency - consider optimization';
  } else {
    recommendation = 'Poor cache efficiency - needs improvement';
  }

  return { efficiency, recommendation };
}
