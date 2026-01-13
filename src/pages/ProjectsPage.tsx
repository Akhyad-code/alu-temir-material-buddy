import React, { useState, useMemo, useCallback } from 'react';
import { Plus, FolderOpen, Grid, List, SortAsc, SortDesc, Calendar, FileText } from 'lucide-react';
import { ProjectCard } from '@/components/ProjectCard';
import { SearchFilter } from '@/components/SearchFilter';
import { Project } from '@/types';

interface ProjectsPageProps {
  projects: Project[];
  onDeleteProject: (id: number) => void;
  onCreateProject: () => void;
}

type SortField = 'name' | 'date' | 'materials';
type SortOrder = 'asc' | 'desc';
type ViewMode = 'grid' | 'list';

export const ProjectsPage: React.FC<ProjectsPageProps> = ({
  projects,
  onDeleteProject,
  onCreateProject,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  const filteredAndSortedProjects = useMemo(() => {
    let result = [...projects];

    // Filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter((project) => {
        if (project.name.toLowerCase().includes(query)) return true;
        if (project.location.toLowerCase().includes(query)) return true;
        if (project.materials.some((m) => m.name.toLowerCase().includes(query))) return true;
        if (project.notes.toLowerCase().includes(query)) return true;
        if (project.date.includes(query)) return true;
        return false;
      });
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'name':
          comparison = a.name.localeCompare(b.name, 'ru');
          break;
        case 'date':
          // Parse DD.MM.YYYY format
          const parseDate = (dateStr: string) => {
            const [day, month, year] = dateStr.split('.').map(Number);
            return new Date(year, month - 1, day).getTime();
          };
          comparison = parseDate(a.date) - parseDate(b.date);
          break;
        case 'materials':
          comparison = a.materials.length - b.materials.length;
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [projects, searchQuery, sortField, sortOrder]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const SortButton: React.FC<{ field: SortField; label: string; icon: React.ReactNode }> = ({
    field,
    label,
    icon,
  }) => (
    <button
      onClick={() => toggleSort(field)}
      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
        sortField === field
          ? 'bg-primary text-primary-foreground'
          : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted'
      }`}
    >
      {icon}
      {label}
      {sortField === field && (
        sortOrder === 'asc' ? <SortAsc size={14} /> : <SortDesc size={14} />
      )}
    </button>
  );

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-1">Мои объекты</h1>
          <p className="text-sm text-muted-foreground">
            {projects.length > 0
              ? `${projects.length} ${projects.length === 1 ? 'проект' : projects.length < 5 ? 'проекта' : 'проектов'}`
              : 'Создайте первый объект'}
          </p>
        </div>

        <button
          onClick={onCreateProject}
          className="btn-icon px-4 py-2.5 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 shadow-card"
          title="Ctrl+N - создать новый проект"
        >
          <Plus size={18} />
          <span>Новый объект</span>
          <kbd className="hidden lg:inline-flex ml-2 px-1.5 py-0.5 bg-primary-foreground/20 rounded text-[10px] font-mono">
            Ctrl+N
          </kbd>
        </button>
      </div>

      {projects.length > 0 && (
        <>
          {/* Search & Filters */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1">
              <SearchFilter
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                searchPlaceholder="Поиск по названию, адресу, дате, материалам... (Ctrl+F)"
              />
            </div>
          </div>

          {/* Sorting & View Toggle */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted-foreground mr-1">Сортировка:</span>
              <SortButton field="date" label="Дата" icon={<Calendar size={14} />} />
              <SortButton field="name" label="Название" icon={<FileText size={14} />} />
              <SortButton field="materials" label="Позиции" icon={<FolderOpen size={14} />} />
            </div>

            <div className="flex items-center bg-card border border-border rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
                title="Сетка"
              >
                <Grid size={18} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
                title="Список"
              >
                <List size={18} />
              </button>
            </div>
          </div>

          {/* Results count */}
          {searchQuery && (
            <div className="mb-4 text-sm text-muted-foreground">
              Найдено: {filteredAndSortedProjects.length} из {projects.length}
            </div>
          )}
        </>
      )}

      {/* Projects Display */}
      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-card rounded-xl shadow-card">
          <div className="w-20 h-20 bg-muted rounded-2xl flex items-center justify-center mb-6">
            <FolderOpen className="w-10 h-10 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">Нет объектов</h2>
          <p className="text-muted-foreground mb-6 max-w-md">
            Создайте первый объект, чтобы начать вести учет материалов
          </p>
          <button
            onClick={onCreateProject}
            className="btn-icon px-5 py-3 rounded-xl text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus size={20} />
            <span>Создать объект</span>
          </button>
        </div>
      ) : filteredAndSortedProjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center bg-card rounded-xl shadow-card">
          <p className="text-muted-foreground mb-4">
            По запросу "{searchQuery}" ничего не найдено
          </p>
          <button
            onClick={() => setSearchQuery('')}
            className="text-sm text-primary hover:underline"
          >
            Сбросить поиск
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
          {filteredAndSortedProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onDelete={onDeleteProject}
            />
          ))}
        </div>
      ) : (
        <div className="bg-card rounded-xl border border-border overflow-hidden shadow-card">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Название</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground hidden md:table-cell">Адрес</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground hidden lg:table-cell">Дата</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-foreground">Позиции</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-foreground">Файлы</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">Действия</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedProjects.map((project, index) => (
                <tr
                  key={project.id}
                  className={`border-b border-border hover:bg-muted/50 transition-colors cursor-pointer ${
                    index % 2 === 0 ? 'bg-card' : 'bg-muted/20'
                  }`}
                  onClick={() => window.location.href = `/project/${project.id}`}
                >
                  <td className="px-4 py-3">
                    <div className="font-medium text-foreground">{project.name}</div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                    {project.location || '—'}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">
                    {project.date}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex items-center justify-center px-2 py-1 bg-primary/10 text-primary rounded-md text-sm font-medium">
                      {project.materials.length}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex items-center justify-center px-2 py-1 bg-purple/10 text-purple rounded-md text-sm font-medium">
                      {project.files.length}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('Удалить проект?')) {
                          onDeleteProject(project.id);
                        }
                      }}
                      className="px-3 py-1.5 text-sm text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                    >
                      Удалить
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Keyboard shortcuts hint */}
      {projects.length > 0 && (
        <div className="mt-6 p-4 bg-card border border-border rounded-xl">
          <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Горячие клавиши:</span>
            <span className="flex items-center gap-1.5">
              <kbd className="px-2 py-1 bg-muted border border-border rounded text-xs font-mono">Ctrl+K</kbd>
              глобальный поиск
            </span>
            <span className="flex items-center gap-1.5">
              <kbd className="px-2 py-1 bg-muted border border-border rounded text-xs font-mono">Ctrl+N</kbd>
              новый проект
            </span>
            <span className="flex items-center gap-1.5">
              <kbd className="px-2 py-1 bg-muted border border-border rounded text-xs font-mono">Ctrl+F</kbd>
              фокус на поиск
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
