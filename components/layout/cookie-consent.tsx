'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Cookie, X } from 'lucide-react';

const COOKIE_CONSENT_KEY = 'toolbox-cookie-consent';

export function CookieConsent() {
  const t = useTranslations('cookieConsent');
  const params = useParams();
  const locale = params.locale as string;
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already given consent
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      // Show banner after a small delay for better UX
      setTimeout(() => setShowBanner(true), 1000);
    }
  }, []);

  const acceptCookies = () => {
    const consentData = {
      consent: 'accepted',
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consentData));
    setShowBanner(false);
  };

  const declineCookies = () => {
    const consentData = {
      consent: 'declined',
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consentData));
    setShowBanner(false);
    
    // Disable AdSense if user declines
    // @ts-ignore
    if (window.adsbygoogle) {
      // @ts-ignore
      window.adsbygoogle.loaded = false;
    }
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-in slide-in-from-bottom-5 duration-500">
      <Card className="max-w-4xl mx-auto p-6 shadow-2xl border-2">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <Cookie className="h-8 w-8 text-primary" />
          </div>
          
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              {t('title')}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {t('description')}
            </p>
            
            <div className="flex flex-wrap gap-3">
              <Button onClick={acceptCookies} size="sm">
                {t('accept')}
              </Button>
              <Button onClick={declineCookies} variant="outline" size="sm">
                {t('decline')}
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <a href={`/${locale}/privacy-policy`} target="_blank" rel="noopener noreferrer">
                  {t('privacyPolicy')}
                </a>
              </Button>
            </div>
          </div>

            <button
              onClick={declineCookies}
              className="flex-shrink-0 p-1 rounded-md hover:bg-muted transition-colors"
              aria-label={t('close') || 'Close'}
            >
            <X className="h-5 w-5" />
          </button>
        </div>
      </Card>
    </div>
  );
}
