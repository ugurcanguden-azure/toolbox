'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Cookie, CheckCircle2, XCircle, Info } from 'lucide-react';

const COOKIE_CONSENT_KEY = 'toolbox-cookie-consent';

interface CookieConsentManagerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CookieConsentManager({ open, onOpenChange }: CookieConsentManagerProps) {
  const t = useTranslations('cookieSettings');
  const [currentConsent, setCurrentConsent] = useState<'accepted' | 'declined' | null>(null);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);

  useEffect(() => {
    // Load current consent status
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (consent) {
      try {
        // Try to parse as JSON (new format)
        const consentData = JSON.parse(consent);
        setCurrentConsent(consentData.consent);
        setAnalyticsEnabled(consentData.consent === 'accepted');
      } catch (e) {
        // Handle old format (plain string)
        if (consent === 'accepted' || consent === 'declined') {
          setCurrentConsent(consent as 'accepted' | 'declined');
          setAnalyticsEnabled(consent === 'accepted');
          
          // Upgrade to new format
          const consentData = {
            consent,
            timestamp: new Date().toISOString(),
          };
          localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consentData));
        }
      }
    }
  }, [open]);

  const savePreferences = (consent: 'accepted' | 'declined') => {
    const consentData = {
      consent,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consentData));
    window.dispatchEvent(new Event('cookie-consent-changed'));
    setCurrentConsent(consent);
    onOpenChange(false);
    
    // Reload page to apply changes (for AdSense)
    window.location.reload();
  };

  const handleAcceptAll = () => {
    savePreferences('accepted');
  };

  const handleDeclineAll = () => {
    savePreferences('declined');
  };

  const handleSavePreferences = () => {
    savePreferences(analyticsEnabled ? 'accepted' : 'declined');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Cookie className="h-6 w-6" />
            {t('title')}
          </DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Current Status */}
          {currentConsent && (
            <Card className="border-muted">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  {t('currentStatus')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Badge
                  variant={currentConsent === 'accepted' ? 'default' : 'secondary'}
                  className="text-sm"
                >
                  {currentConsent === 'accepted' ? (
                    <>
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      {t('accepted')}
                    </>
                  ) : (
                    <>
                      <XCircle className="h-3 w-3 mr-1" />
                      {t('declined')}
                    </>
                  )}
                </Badge>
              </CardContent>
            </Card>
          )}

          {/* Necessary Cookies (Always Active) */}
          <Card className="border-muted">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{t('necessary.title')}</span>
                <Badge variant="outline" className="text-xs">
                  {t('necessary.alwaysActive')}
                </Badge>
              </CardTitle>
              <CardDescription>{t('necessary.description')}</CardDescription>
            </CardHeader>
          </Card>

          {/* Analytics & Advertising Cookies */}
          <Card className="border-muted">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{t('analytics.title')}</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={analyticsEnabled}
                    onChange={(e) => setAnalyticsEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/40 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                </label>
              </CardTitle>
              <CardDescription>{t('analytics.description')}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{t('analytics.items')}</p>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 mt-6">
          <Button onClick={handleAcceptAll} className="flex-1">
            {t('acceptAll')}
          </Button>
          <Button onClick={handleSavePreferences} variant="outline" className="flex-1">
            {t('savePreferences')}
          </Button>
          <Button onClick={handleDeclineAll} variant="secondary" className="flex-1">
            {t('declineAll')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
