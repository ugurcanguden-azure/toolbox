"use client";

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Search, History, FolderOpen, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useTools, useFavorites } from '@/hooks';
import { Tool } from '@/types';

export function Sidebar({ locale }: { locale: string }) {
  const tCommon = useTranslations('common');
  const { tools, categories } = useTools(locale);
  const { recent } = useFavorites();
  const pathname = usePathname();

  const [searchQuery, setSearchQuery] = useState("");
  const [collapsed, setCollapsed] = useState(false);

  const filteredTools = useMemo(() => {
    if (!searchQuery) return tools;
    return tools.filter((t) => 
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      t.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [tools, searchQuery]);

  const recentTools = useMemo(() => {
    return recent.map((id) => tools.find((t) => t.id === id)).filter(Boolean) as Tool[];
  }, [recent, tools]);
  
  // Categorize for rendering
  const toolsByCategory = useMemo(() => {
    const map: Record<string, Tool[]> = {};
    filteredTools.forEach(t => {
      if (!map[t.category]) map[t.category] = [];
      map[t.category].push(t);
    });
    return map;
  }, [filteredTools]);

  return (
    <aside
      className={`border-r border-border hidden lg:flex flex-col h-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-200 ${collapsed ? 'w-20' : 'w-72'}`}
    >
      <div className="p-4 border-b border-border space-y-4">
        {!collapsed && (
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={tCommon('searchTools')}
              className="pl-8 h-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label={tCommon('searchTools')}
            />
          </div>
        )}
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent">
        {collapsed ? (
          <ul className="space-y-2">
            {filteredTools.map((tool) => {
              const isActive = pathname === tool.href;
              const Icon = (LucideIcons as any)[tool.icon] || FolderOpen;
              return (
                <li key={tool.id}>
                  <Link
                    href={tool.href}
                    title={tool.title}
                    className={`flex items-center justify-center text-xs font-semibold h-9 rounded-md transition-colors ${isActive ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-muted'}`}
                  >
                    <Icon className="h-4 w-4" />
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : (
          <>
        {/* Most Used / Recent */}
        {!searchQuery && recentTools.length > 0 && (
          <div>
            <h4 className="flex items-center text-xs font-semibold uppercase text-muted-foreground mb-3 tracking-wider">
              <History className="mr-2 w-3 h-3" /> Most Used
            </h4>
            <ul className="space-y-1">
              {recentTools.slice(0, 5).map(tool => {
                const isActive = pathname === tool.href;
                const Icon = (LucideIcons as any)[tool.icon] || FolderOpen;
                return (
                  <li key={tool.id}>
                    <Link href={tool.href} className={`flex items-center text-sm px-3 py-2 rounded-md transition-colors ${isActive ? 'bg-primary/10 text-primary font-medium' : 'text-foreground hover:bg-muted'}`}>
                      <Icon className="mr-2 h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{tool.title}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* Categories */}
        {categories.filter(c => c.id !== 'all').map(category => {
          const catTools = toolsByCategory[category.id] || [];
          if (catTools.length === 0) return null;
          return (
            <div key={category.id}>
              <h4 className="flex items-center text-xs font-semibold uppercase text-muted-foreground mb-3 tracking-wider">
                <FolderOpen className="mr-2 w-3 h-3" /> {category.label}
              </h4>
              <ul className="space-y-1">
                {catTools.map(tool => {
                  const isActive = pathname === tool.href;
                  const Icon = (LucideIcons as any)[tool.icon] || FolderOpen;
                  return (
                    <li key={tool.id}>
                      <Link href={tool.href} className={`flex items-center text-sm px-3 py-2 rounded-md transition-colors ${isActive ? 'bg-primary/10 text-primary font-medium' : 'text-foreground hover:bg-muted'}`}>
                        <Icon className="mr-2 h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{tool.title}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
          </>
        )}
      </div>
      <div className="border-t border-border p-2 pb-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed((prev) => !prev)}
          className="w-full h-9"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
        </Button>
      </div>
    </aside>
  );
}
