import React from 'react';
import { Search, Filter, X } from 'lucide-react';

interface SearchFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filterValue?: string;
  onFilterChange?: (value: string) => void;
  filterOptions?: { value: string; label: string }[];
  filterLabel?: string;
  searchPlaceholder?: string;
}

export const SearchFilter: React.FC<SearchFilterProps> = ({
  searchQuery,
  onSearchChange,
  filterValue,
  onFilterChange,
  filterOptions,
  filterLabel = 'Категория',
  searchPlaceholder = 'Поиск...',
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className="input-field pl-10 pr-10"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Filter Select */}
      {filterOptions && onFilterChange && (
        <div className="relative min-w-[180px]">
          <Filter
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
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
        </div>
      )}
    </div>
  );
};
