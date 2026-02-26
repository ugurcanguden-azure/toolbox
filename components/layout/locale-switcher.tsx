'use client';

import * as React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { locales, type Locale } from '@/i18n/request';
import { Button } from '@/components/ui';
import { Languages } from 'lucide-react';

interface LocaleSwitcherProps {
  currentLocale: Locale;
}

const localeNames: Record<Locale, string> = {
  en: 'English',
  de: 'Deutsch',
  tr: 'Türkçe',
  fr: 'Français',
  pt: 'Português',
  es: 'Español',
  it: 'Italiano',
  nl: 'Nederlands',
  ja: '日本語',
  ru: 'Русский',
};

export function LocaleSwitcher({ currentLocale }: LocaleSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);

  const handleLocaleChange = (newLocale: Locale) => {
    const segments = pathname.split('/');
    segments[1] = newLocale;
    router.push(segments.join('/'));
    setIsOpen(false);
  };

  return (
    <div className="relative">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="gap-2"
          aria-label="Select Language"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        >
        <Languages className="h-4 w-4" />
        <span className="hidden sm:inline">{localeNames[currentLocale]}</span>
      </Button>
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full z-50 mt-2 min-w-[150px] rounded-md border bg-popover p-1 shadow-md">
            {locales.map((locale) => (
              <button
                key={locale}
                onClick={() => handleLocaleChange(locale)}
                className={`w-full rounded-sm px-3 py-2 text-left text-sm hover:bg-accent ${
                  locale === currentLocale ? 'bg-accent font-medium' : ''
                }`}
              >
                {localeNames[locale]}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

