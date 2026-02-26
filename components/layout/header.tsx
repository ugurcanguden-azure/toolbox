'use client';

import * as React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ThemeToggle } from './theme-toggle';
import { LocaleSwitcher } from './locale-switcher';
import { CommandPalette } from './command-palette';
import type { Locale } from '@/i18n/request';
import { Code2, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  locale: Locale;
}

export function Header({ locale }: HeaderProps) {
  const tCommon = useTranslations('common');
  const tNav = useTranslations('navigation');
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href={`/${locale}`} className="flex items-center gap-2 font-bold text-xl" aria-label={`${tCommon('appName')} - ${tCommon('home') ?? 'Home'}`}>
          <Code2 className="h-6 w-6" />
          <span className="hidden sm:inline">{tCommon('appName')}</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href={`/${locale}`} className="text-sm font-medium hover:text-primary transition-colors">
            {tNav('home')}
          </Link>
          <Link href={`/${locale}/blog`} className="text-sm font-medium hover:text-primary transition-colors">
            {tNav('blog')}
          </Link>
          <Link href={`/${locale}/about`} className="text-sm font-medium hover:text-primary transition-colors">
            {tNav('about')}
          </Link>
        </nav>

        <div className="flex flex-1 items-center justify-end gap-2 px-4 md:px-0">
          <div className="w-full max-w-sm ml-auto sm:w-auto">
            <CommandPalette locale={locale} />
          </div>
          <LocaleSwitcher currentLocale={locale} />
          <ThemeToggle />
          
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div id="mobile-nav" className="md:hidden border-t bg-background">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-3">
            <Link
              href={`/${locale}`}
              className="text-sm font-medium hover:text-primary transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              {tNav('home')}
            </Link>
            <Link
              href={`/${locale}/blog`}
              className="text-sm font-medium hover:text-primary transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              {tNav('blog')}
            </Link>
            <Link
              href={`/${locale}/about`}
              className="text-sm font-medium hover:text-primary transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              {tNav('about')}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

