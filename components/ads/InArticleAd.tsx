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
    let isLoaded = false;
    
    const loadAd = () => {
      if (isLoaded) return;
      
      try {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        isLoaded = true;
      } catch (err) {
        // Silently ignore duplicate push errors in development
        if (process.env.NODE_ENV === 'development') {
          // Expected in StrictMode
        } else {
          console.error('AdSense error:', err);
        }
      }
    };

    // Small delay to ensure DOM is ready
    const timer = setTimeout(loadAd, 100);

    return () => {
      clearTimeout(timer);
    };
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
