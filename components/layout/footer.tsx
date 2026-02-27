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
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4 text-xs text-muted-foreground">
            <p className="flex items-center gap-1 whitespace-nowrap">
              {t('madeWith')} <Heart className="h-4 w-4 fill-red-500 text-red-500" /> {t('by')}
            </p>

            <div className="flex items-center justify-end gap-3 whitespace-nowrap">
              <Button
                variant="link"
                size="sm"
                className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
                asChild
              >
                <a href={`/${locale}/privacy-policy`} target="_blank" rel="noopener noreferrer">
                  {t('privacyPolicy')}
                </a>
              </Button>
              <span className="text-muted-foreground/50">•</span>
              <Button
                variant="link"
                size="sm"
                className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
                onClick={() => setShowCookieSettings(true)}
              >
                {t('cookieSettings')}
              </Button>
            </div>
          </div>
        </div>
      </footer>

      <CookieConsentManager open={showCookieSettings} onOpenChange={setShowCookieSettings} />
    </>
  );
}
