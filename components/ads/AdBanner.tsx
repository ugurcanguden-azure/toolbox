'use client';

import { useEffect } from 'react';
import { useCookieConsent } from '@/hooks';

interface AdBannerProps {
  dataAdSlot: string;
  dataAdFormat?: string;
  dataFullWidthResponsive?: boolean;
  className?: string;
}

/**
 * Google AdSense Banner Component
 * Only displays ads if user has accepted cookies
 * Usage: <AdBanner dataAdSlot="YOUR_AD_SLOT_ID" />
 */
export function AdBanner({
  dataAdSlot,
  dataAdFormat = 'auto',
  dataFullWidthResponsive = true,
  className = '',
}: AdBannerProps) {
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
        style={{ display: 'block' }}
        data-ad-client="ca-pub-9339461513261360"
        data-ad-slot={dataAdSlot}
        data-ad-format={dataAdFormat}
        data-full-width-responsive={dataFullWidthResponsive.toString()}
        // If consent declined, request non-personalized ads
        {...(!hasConsent && { 'data-npa': '1' })}
      />
    </div>
  );
}
