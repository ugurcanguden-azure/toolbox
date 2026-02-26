"use client";

import { useState, useMemo, useEffect, use } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Search, Star, Clock, X, GripHorizontal } from 'lucide-react';
import { ToolCard, AdBanner } from '@/components';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useFavorites, useTools } from '@/hooks';
import type { Tool } from '@/types';
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Wrapper component for draggable items
function DraggableToolCard({ tool, isFavorite, onToggleFavorite, onCardClick }: any) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: tool.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 1,
    position: 'relative' as const,
  };

  return (
    <div ref={setNodeRef} style={style} className="h-full">
      <div 
        {...attributes} 
        {...listeners} 
        className="absolute top-2 left-2 p-1.5 cursor-grab active:cursor-grabbing z-20 text-muted-foreground/50 hover:text-foreground bg-background/60 hover:bg-background/90 rounded-md border border-border/50 hover:border-border transition-all"
        title="Sürükleyerek sırala"
      >
        <GripHorizontal className="w-4 h-4" />
      </div>
      <ToolCard
        tool={tool}
        isFavorite={isFavorite}
        onToggleFavorite={onToggleFavorite}
        onCardClick={onCardClick}
      />
    </div>
  );
}

export default function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const t = useTranslations();
  const { locale } = use(params);
  const { favorites, recent, toggleFavorite, addToRecent, clearRecent, isFavorite } = useFavorites();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const { tools, categories } = useTools(locale);

  const [orderedToolIds, setOrderedToolIds] = useState<string[]>([]);

  // Load saved order on mount
  useEffect(() => {
    const saved = localStorage.getItem('curiobox-tool-order');
    if (saved) {
      try {
        setOrderedToolIds(JSON.parse(saved));
      } catch (e) {
        // ignore
      }
    }
  }, []);

  // Filter tools
  const filteredTools = useMemo(() => {
    // Determine the base list, sorted by custom order if available
    let orderedList = [...tools];
    if (orderedToolIds.length > 0) {
      orderedList.sort((a, b) => {
        const indexA = orderedToolIds.indexOf(a.id);
        const indexB = orderedToolIds.indexOf(b.id);
        
        if (indexA !== -1 && indexB !== -1) return indexA - indexB;
        if (indexA !== -1) return -1;
        if (indexB !== -1) return 1;
        return 0;
      });
    }

    return orderedList.filter((tool) => {
      const matchesSearch = 
        tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [tools, searchQuery, selectedCategory, orderedToolIds]);

  // Favorite tools
  const favoriteTools = useMemo(() => {
    return tools.filter((tool) => favorites.includes(tool.id));
  }, [tools, favorites]);

  // Recent tools
  const recentTools = useMemo(() => {
    return recent.map((id) => tools.find((tool) => tool.id === id)).filter(Boolean) as Tool[];
  }, [tools, recent]);

  // DnD Sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px movement before drag starts so clicking still works
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = filteredTools.findIndex(t => t.id === active.id);
      const newIndex = filteredTools.findIndex(t => t.id === over.id);

      const newOrderIds = arrayMove(filteredTools.map(t => t.id), oldIndex, newIndex);
      setOrderedToolIds(newOrderIds);
      localStorage.setItem('curiobox-tool-order', JSON.stringify(newOrderIds));
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="mb-12 text-center">
        <Image
          src="/icon.svg"
          alt={t('common.appName')}
          width={96}
          height={96}
          priority
          fetchPriority="high"
          className="mx-auto mb-4 h-20 w-20 sm:h-24 sm:w-24"
        />
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl mb-6 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          {t('common.appName')}
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {t('common.appDescription')}
        </p>
      </div>

      {/* Ad - Top Banner (after hero) */}
      {/* <AdBanner 
        dataAdSlot="1234567890"
        className="max-w-7xl mx-auto mb-12"
      /> */}

      {/* Search & Filter Section */}
      <div className="mb-12 space-y-6">
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder={t('common.search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-lg"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className="transition-all"
            >
              {category.label}
              {category.id === 'all' && (
                <span className="ml-2 px-2 py-0.5 rounded-full bg-primary-foreground text-primary text-xs font-bold">
                  {tools.length}
                </span>
              )}
            </Button>
          ))}
        </div>

        {/* Results Count */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            {filteredTools.length === tools.length
              ? `${tools.length} tools available`
              : `Showing ${filteredTools.length} of ${tools.length} tools`}
          </p>
        </div>
      </div>

      {/* Ad - After Search/Filter */}
      {/* <AdBanner 
        dataAdSlot="0987654321"
        className="max-w-7xl mx-auto mb-12"
      /> */}

      {/* Favorites Section */}
      {favoriteTools.length > 0 && searchQuery === "" && selectedCategory === "all" && (
        <div className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
              {t('common.favorites')}
            </h2>
            <span className="text-sm text-muted-foreground">{favoriteTools.length} tools</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteTools.map((tool) => (
              <ToolCard
                key={tool.id}
                tool={tool}
                isFavorite={true}
                onToggleFavorite={toggleFavorite}
                onCardClick={addToRecent}
              />
            ))}
          </div>
        </div>
      )}

      {/* Recent Section */}
      {recentTools.length > 0 && searchQuery === "" && selectedCategory === "all" && (
        <div className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <Clock className="h-6 w-6 text-primary" />
              {t('common.recent')}
            </h2>
            <Button variant="ghost" size="sm" onClick={clearRecent}>
              <X className="h-4 w-4 mr-2" />
              {t('common.clearRecent')}
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentTools.slice(0, 6).map((tool) => (
              <ToolCard
                key={tool.id}
                tool={tool}
                isFavorite={isFavorite(tool.id)}
                onToggleFavorite={toggleFavorite}
                onCardClick={addToRecent}
              />
            ))}
          </div>
        </div>
      )}

      {/* All Tools Grid with DnD */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">{t('common.allTools')}</h2>
        {filteredTools.length > 0 ? (
          <DndContext 
            id="dashboard-dnd"
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext 
              items={filteredTools.map(t => t.id)}
              strategy={rectSortingStrategy}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTools.map((tool, index) => (
                  <div
                    key={tool.id}
                    className="relative animate-in fade-in slide-in-from-bottom-4 group"
                    style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'backwards' }}
                  >
                    <DraggableToolCard
                      tool={tool}
                      isFavorite={isFavorite(tool.id)}
                      onToggleFavorite={toggleFavorite}
                      onCardClick={addToRecent}
                    />
                  </div>
                ))}
              </div>
            </SortableContext>
          </DndContext>
        ) : (
          <div className="text-center py-12 animate-in fade-in duration-500">
            <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg text-muted-foreground mb-2">No tools found</p>
            <p className="text-sm text-muted-foreground">Try a different search or category</p>
          </div>
        )}
      </div>

      {/* Ad - Bottom Banner */}
      {/* <AdBanner 
        dataAdSlot="5555555555"
        className="max-w-7xl mx-auto mb-12"
      /> */}
    </div>
  );
}
