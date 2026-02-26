'use client';

import * as React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui';
import { Button } from '@/components/ui/button';
import { useLoading } from '@/contexts/loading-context';
import type { Tool } from '@/types';
import * as Icons from 'lucide-react';
import { toolCategories } from '@/lib/tools-data';

interface ToolCardProps {
  tool: Tool;
  isFavorite?: boolean;
  onToggleFavorite?: (toolId: string) => void;
  onCardClick?: (toolId: string) => void;
}

export function ToolCard({ tool, isFavorite = false, onToggleFavorite, onCardClick }: ToolCardProps) {
  const t = useTranslations('common');
  const { startLoading } = useLoading();
  const Icon = (Icons as any)[tool.icon] || Icons.Wrench;

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleFavorite?.(tool.id);
  };

  const handleCardClick = () => {
    startLoading(); // Loading başlat
    onCardClick?.(tool.id);
  };

  const categoryData = toolCategories[tool.category];
  const iconColor = categoryData?.color || 'text-primary';
  const bgColor = iconColor.replace('text-', 'bg-').replace('-500', '-500/10');

  return (
    <Link href={tool.href} className="block h-full group" onClick={handleCardClick} aria-label={`Open ${tool.title}`}>
      <Card className="h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-border/50 hover:border-primary/30 relative overflow-hidden bg-gradient-to-br from-background to-muted/20">
        {/* Favorite Button */}
        {onToggleFavorite && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleFavoriteClick}
            title={isFavorite ? t('removeFromFavorites') : t('addToFavorites')}
            aria-label={isFavorite ? t('removeFromFavorites') : t('addToFavorites')}
            aria-pressed={isFavorite}
          >
            {isFavorite ? (
              <Icons.Star className="h-5 w-5 fill-yellow-400 text-yellow-400 drop-shadow-sm" />
            ) : (
              <Icons.Star className="h-5 w-5 text-muted-foreground hover:text-yellow-400" />
            )}
          </Button>
        )}

        <CardHeader className="p-6">
          <div className={`mb-4 w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:-rotate-3 shadow-sm ${bgColor}`}>
            <Icon className={`h-6 w-6 ${iconColor}`} />
          </div>
          <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors leading-tight mb-1.5">
            {tool.title}
          </CardTitle>
          <CardDescription className="line-clamp-2 text-sm text-muted-foreground/80 leading-relaxed">
            {tool.description}
          </CardDescription>
        </CardHeader>

        {/* Animated gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </Card>
    </Link>
  );
}

