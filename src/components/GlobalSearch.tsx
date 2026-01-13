import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Search, X, Command, ArrowUp, ArrowDown, CornerDownLeft, Keyboard } from 'lucide-react';

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
  projects: { id: number; name: string; location: string }[];
  templates: { id: number; name: string; category: string }[];
}

interface SearchResult {
  type: 'project' | 'template' | 'page';
  id: number | string;
  title: string;
  subtitle?: string;
  path: string;
}

export const GlobalSearch: React.FC<GlobalSearchProps> = ({
  isOpen,
  onClose,
  onNavigate,
  projects,
  templates,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [results, setResults] = useState<SearchResult[]>([]);

  // Static pages
  const pages: SearchResult[] = [
    { type: 'page', id: 'projects', title: 'Объекты', subtitle: 'Список всех проектов', path: '/' },
    { type: 'page', id: 'calculator', title: 'Калькулятор', subtitle: 'Расчёт материалов', path: '/calculator' },
    { type: 'page', id: 'templates', title: 'Шаблоны', subtitle: 'Библиотека шаблонов', path: '/templates' },
  ];

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    const searchQuery = query.toLowerCase().trim();
    
    if (!searchQuery) {
      setResults(pages);
      return;
    }

    const matchedResults: SearchResult[] = [];

    // Search pages
    pages.forEach((page) => {
      if (page.title.toLowerCase().includes(searchQuery)) {
        matchedResults.push(page);
      }
    });

    // Search projects
    projects.forEach((project) => {
      if (
        project.name.toLowerCase().includes(searchQuery) ||
        project.location.toLowerCase().includes(searchQuery)
      ) {
        matchedResults.push({
          type: 'project',
          id: project.id,
          title: project.name,
          subtitle: project.location || 'Без адреса',
          path: `/project/${project.id}`,
        });
      }
    });

    // Search templates
    templates.forEach((template) => {
      if (
        template.name.toLowerCase().includes(searchQuery) ||
        template.category.toLowerCase().includes(searchQuery)
      ) {
        matchedResults.push({
          type: 'template',
          id: template.id,
          title: template.name,
          subtitle: `Шаблон: ${template.category}`,
          path: '/templates',
        });
      }
    });

    setResults(matchedResults);
    setSelectedIndex(0);
  }, [query, projects, templates]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) => Math.max(prev - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (results[selectedIndex]) {
            onNavigate(results[selectedIndex].path);
            onClose();
          }
          break;
        case 'Escape':
          onClose();
          break;
      }
    },
    [results, selectedIndex, onNavigate, onClose]
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-foreground/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Search Modal */}
      <div className="relative bg-card rounded-xl shadow-xl w-full max-w-2xl mx-4 overflow-hidden border border-border animate-scale-in">
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-border">
          <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Поиск по проектам, шаблонам, страницам..."
            className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground text-base"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Results */}
        <div className="max-h-[400px] overflow-y-auto">
          {results.length === 0 ? (
            <div className="px-4 py-8 text-center text-muted-foreground">
              Ничего не найдено по запросу "{query}"
            </div>
          ) : (
            <div className="py-2">
              {results.map((result, index) => (
                <button
                  key={`${result.type}-${result.id}`}
                  onClick={() => {
                    onNavigate(result.path);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                    index === selectedIndex
                      ? 'bg-primary/10 text-primary'
                      : 'text-foreground hover:bg-muted'
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{result.title}</div>
                    {result.subtitle && (
                      <div className="text-sm text-muted-foreground truncate">
                        {result.subtitle}
                      </div>
                    )}
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-medium ${
                      result.type === 'project'
                        ? 'bg-primary/10 text-primary'
                        : result.type === 'template'
                        ? 'bg-accent/10 text-accent'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {result.type === 'project'
                      ? 'Проект'
                      : result.type === 'template'
                      ? 'Шаблон'
                      : 'Страница'}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer with shortcuts */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/50 text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 bg-card border border-border rounded text-[10px] font-mono">↑</kbd>
              <kbd className="px-1.5 py-0.5 bg-card border border-border rounded text-[10px] font-mono">↓</kbd>
              навигация
            </span>
            <span className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 bg-card border border-border rounded text-[10px] font-mono">Enter</kbd>
              открыть
            </span>
            <span className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 bg-card border border-border rounded text-[10px] font-mono">Esc</kbd>
              закрыть
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
