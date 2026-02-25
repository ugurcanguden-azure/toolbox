'use client';

import { useEffect, useState } from 'react';
import { AdUnit } from 'next-google-adsense';
import { useCookieConsent } from '@/hooks';

interface InArticleAdProps {
  dataAdSlot: string;
  className?: string;
}

/**
 * Google AdSense In-Article Ad Component (via next-google-adsense)
 * - Clean integration with next-google-adsense library
 * - Respects user cookie consent (GDPR/CCPA compliant)
 * - Non-personalized ads when consent declined
 * For placing ads within content
 */
export function InArticleAd({
  dataAdSlot,
  className = 'my-8',
}: InArticleAdProps) {
  const { hasConsent, isLoading } = useCookieConsent();
  const [isMounted, setIsMounted] = useState(false);

  // Prevent SSR/hydration issues
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Show placeholder while loading consent
  if (!isMounted || isLoading) {
    return <div className={className} style={{ minHeight: '100px' }} />;
  }
    /*  <AdUnit
        publisherId="ca-pub-9339461513261360"
        slotId={dataAdSlot}
        layout="in-article"
        // Non-personalized ads when consent declined
        {...(!hasConsent && { 'data-npa': '1' })}
      />*/
  return (
    <div className={className}>

    </div>
  );
}
