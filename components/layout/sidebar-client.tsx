'use client';

import dynamic from 'next/dynamic';

const SidebarNoSSR = dynamic(
  () => import('./sidebar').then((mod) => mod.Sidebar),
  { ssr: false }
);

export function SidebarClient({ locale }: { locale: string }) {
  return <SidebarNoSSR locale={locale} />;
}
