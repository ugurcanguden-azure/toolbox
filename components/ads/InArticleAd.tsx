'use client';

import { useEffect } from 'react';
import { useCookieConsent } from '@/hooks';

interface InArticleAdProps {
  dataAdSlot: string;
  className?: string;
}

/**
 * Google AdSense In-Article Ad Component
 * Only displays ads if user has accepted cookies
 * For placing ads within content
 */
export function InArticleAd({
  dataAdSlot,
  className = 'my-8',
}: InArticleAdProps) {
  const { hasConsent, isLoading } = useCookieConsent();

  useEffect(() => {
    // Load ads regardless of consent status
    // Non-personalized ads shown if consent declined
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, []);

  // Don't render while checking consent
  if (isLoading) {
    return null;
  }

  return (
    <div className={className}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', textAlign: 'center' }}
        data-ad-client="ca-pub-9339461513261360"
        data-ad-slot={dataAdSlot}
        data-ad-format="fluid"
        data-ad-layout="in-article"
        // If consent declined, request non-personalized ads
        {...(!hasConsent && { 'data-npa': '1' })}
      />
    </div>
  );
}
