'use client';

import { useLoading } from '@/contexts/loading-context';
import { useTranslations } from 'next-intl';
import { Loader2, Wrench } from 'lucide-react';

export function GlobalLoading() {
  const { isLoading } = useLoading();
  const t = useTranslations('common');

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-background/80 backdrop-blur-sm flex items-center justify-center">
      <div className="flex flex-col items-center justify-center space-y-6">
        {/* Tool icon with pulse animation */}
        <div className="relative">
          <div className="absolute inset-0 animate-ping">
            <Wrench className="h-12 w-12 text-primary/20" />
          </div>
          <Wrench className="relative h-12 w-12 text-primary" />
        </div>
        
        {/* Spinning loader */}
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        
        {/* Loading text with gradient - TRANSLATED */}
        <div className="text-center space-y-2">
          <p className="text-xl font-semibold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            {t('loadingTool')}
          </p>
          <p className="text-sm text-muted-foreground">
            {t('pleaseWait')}
          </p>
        </div>

        {/* Progress bar with slide animation */}
        <div className="w-64 h-1 bg-muted rounded-full overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary to-transparent animate-slide w-1/2" />
        </div>
      </div>
    </div>
  );
}

