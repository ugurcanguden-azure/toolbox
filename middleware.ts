import createMiddleware from 'next-intl/middleware';
import { locales } from './i18n/request';
import { NextRequest, NextResponse } from 'next/server';

// URL Normalization Middleware
function normalizeUrl(request: NextRequest): NextResponse | null {
  const url = request.nextUrl.clone();
  const { pathname, search, hash } = url;

  // Force HTTPS in production
  if (
    process.env.NODE_ENV === 'production' &&
    request.headers.get('x-forwarded-proto') !== 'https'
  ) {
    url.protocol = 'https:';
    return NextResponse.redirect(url, 301);
  }

  // Normalize case for paths (optional - can be aggressive)
  const normalizedPathname = pathname.toLowerCase();
  if (pathname !== normalizedPathname && !pathname.includes('.')) {
    url.pathname = normalizedPathname;
    return NextResponse.redirect(url, 301);
  }

  return null;
}

// Enhanced middleware with URL normalization
export function middleware(request: NextRequest) {
  // Apply URL normalization first
  const normalizedResponse = normalizeUrl(request);
  if (normalizedResponse) {
    return normalizedResponse;
  }

  // Apply next-intl middleware
  return createMiddleware({
    locales,
    defaultLocale: 'en',
    localePrefix: 'always',
  })(request);
}

export const config = {
  matcher: ['/', '/(de|en|tr|fr|pt|es|it|nl|ja|ru)/:path*'],
};
