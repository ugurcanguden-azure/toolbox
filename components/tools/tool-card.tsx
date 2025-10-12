'use client';

import * as React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui';
import { Button } from '@/components/ui/button';
import { useLoading } from '@/contexts/loading-context';
import type { Tool } from '@/types';
import * as Icons from 'lucide-react';

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

  return (
    <Link href={tool.href} className="block h-full group" onClick={handleCardClick}>
      <Card className="h-full transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:border-primary/50 relative overflow-hidden">
        {/* Favorite Button */}
        {onToggleFavorite && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleFavoriteClick}
            title={isFavorite ? t('removeFromFavorites') : t('addToFavorites')}
          >
            {isFavorite ? (
              <Icons.Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            ) : (
              <Icons.Star className="h-5 w-5 text-muted-foreground hover:text-yellow-400" />
            )}
          </Button>
        )}

        <CardHeader>
          <div className="mb-3 transition-transform duration-300 group-hover:scale-110">
            <Icon className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-lg group-hover:text-primary transition-colors">
            {tool.title}
          </CardTitle>
          <CardDescription className="line-clamp-2">{tool.description}</CardDescription>
        </CardHeader>

        {/* Animated gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </Card>
    </Link>
  );
}

