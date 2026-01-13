import React from 'react';
import { Search, Filter, X, Keyboard } from 'lucide-react';

interface SearchFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filterValue?: string;
  onFilterChange?: (value: string) => void;
  filterOptions?: { value: string; label: string }[];
  filterLabel?: string;
  searchPlaceholder?: string;
  showShortcut?: boolean;
}

export const SearchFilter: React.FC<SearchFilterProps> = ({
  searchQuery,
  onSearchChange,
  filterValue,
  onFilterChange,
  filterOptions,
  filterLabel = 'Категория',
  searchPlaceholder = 'Поиск...',
  showShortcut = true,
}) => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Handle Ctrl+F to focus search
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
        />
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className="input-field pl-10 pr-20"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {searchQuery ? (
            <button
              onClick={() => onSearchChange('')}
              className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              title="Очистить (Esc)"
            >
              <X size={16} />
            </button>
          ) : showShortcut ? (
            <kbd className="hidden sm:inline-flex px-1.5 py-0.5 bg-muted border border-border rounded text-[10px] font-mono text-muted-foreground">
              Ctrl+F
            </kbd>
          ) : null}
        </div>
      </div>

      {/* Filter Select */}
      {filterOptions && onFilterChange && (
        <div className="relative min-w-[200px]">
          <Filter
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          />
          <select
            value={filterValue || ''}
            onChange={(e) => onFilterChange(e.target.value)}
            className="input-field pl-10 pr-4 appearance-none cursor-pointer"
          >
            <option value="">Все {filterLabel.toLowerCase()}</option>
            {filterOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg
              className="w-4 h-4 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};
