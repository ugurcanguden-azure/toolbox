'use client';

import { useEffect } from 'react';

interface InArticleAdProps {
  dataAdSlot: string;
  className?: string;
}

/**
 * Google AdSense In-Article Ad Component
 * For placing ads within content
 */
export function InArticleAd({
  dataAdSlot,
  className = 'my-8',
}: InArticleAdProps) {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, []);

  return (
    <div className={className}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', textAlign: 'center' }}
        data-ad-client="ca-pub-9339461513261360"
        data-ad-slot={dataAdSlot}
        data-ad-format="fluid"
        data-ad-layout="in-article"
      />
    </div>
  );
}
