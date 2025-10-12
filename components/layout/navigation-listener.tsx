'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useLoading } from '@/contexts/loading-context';

export function NavigationListener() {
  const pathname = usePathname();
  const { stopLoading } = useLoading();

  // Route değiştiğinde loading'i durdur
  useEffect(() => {
    stopLoading();
  }, [pathname, stopLoading]);

  return null;
}

