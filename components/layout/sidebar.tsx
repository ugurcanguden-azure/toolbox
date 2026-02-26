"use client";

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, History, FolderOpen } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useTools, useFavorites } from '@/hooks';
import { Tool } from '@/types';

export function Sidebar({ locale }: { locale: string }) {
  const { tools, categories } = useTools(locale);
  const { recent } = useFavorites();
  const pathname = usePathname();

  const [searchQuery, setSearchQuery] = useState("");

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
    <aside className="w-72 border-r border-border h-full hidden lg:flex flex-col bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-16" style={{ height: "calc(100vh - 4rem)" }}>
      <div className="p-4 border-b border-border">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search tools..." 
            className="pl-8 h-9" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search tools"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent">
        {/* Most Used / Recent */}
        {!searchQuery && recentTools.length > 0 && (
          <div>
            <h4 className="flex items-center text-xs font-semibold uppercase text-muted-foreground mb-3 tracking-wider">
              <History className="mr-2 w-3 h-3" /> Most Used
            </h4>
            <ul className="space-y-1">
              {recentTools.slice(0, 5).map(tool => {
                const isActive = pathname === tool.href;
                return (
                  <li key={tool.id}>
                    <Link href={tool.href} className={`flex items-center text-sm px-3 py-2 rounded-md transition-colors ${isActive ? 'bg-primary/10 text-primary font-medium' : 'text-foreground hover:bg-muted'}`}>
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
                  return (
                    <li key={tool.id}>
                      <Link href={tool.href} className={`flex items-center text-sm px-3 py-2 rounded-md transition-colors ${isActive ? 'bg-primary/10 text-primary font-medium' : 'text-foreground hover:bg-muted'}`}>
                        <span className="truncate">{tool.title}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
