'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CookieConsentManager } from './cookie-consent-manager';

export function Footer() {
  const t = useTranslations('footer');
  const params = useParams();
  const locale = params.locale as string;
  const [showCookieSettings, setShowCookieSettings] = React.useState(false);

  return (
    <>
      <footer className="w-full border-t bg-background">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col items-center justify-center gap-4 text-center text-sm text-muted-foreground">
            <p className="flex items-center gap-1">
              {t('madeWith')} <Heart className="h-4 w-4 fill-red-500 text-red-500" /> {t('by')}
            </p>
            
            {/* Footer Links */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button variant="link" size="sm" className="h-auto p-0 text-muted-foreground hover:text-foreground" asChild>
                <a href={`/${locale}/privacy-policy`} target="_blank" rel="noopener noreferrer">
                  {t('privacyPolicy')}
                </a>
              </Button>
              <span className="text-muted-foreground/50">•</span>
              <Button 
                variant="link" 
                size="sm" 
                className="h-auto p-0 text-muted-foreground hover:text-foreground"
                onClick={() => setShowCookieSettings(true)}
              >
                {t('cookieSettings')}
              </Button>
            </div>
          </div>
        </div>
      </footer>

      {/* Cookie Settings Dialog */}
      <CookieConsentManager 
        open={showCookieSettings} 
        onOpenChange={setShowCookieSettings} 
      />
    </>
  );
}

