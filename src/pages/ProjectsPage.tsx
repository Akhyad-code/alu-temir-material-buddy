import React, { useState, useMemo } from 'react';
import { Plus, FolderOpen } from 'lucide-react';
import { ProjectCard } from '@/components/ProjectCard';
import { SearchFilter } from '@/components/SearchFilter';
import { Project } from '@/types';

interface ProjectsPageProps {
  projects: Project[];
  onDeleteProject: (id: number) => void;
  onCreateProject: () => void;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({
  projects,
  onDeleteProject,
  onCreateProject,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProjects = useMemo(() => {
    if (!searchQuery.trim()) return projects;

    const query = searchQuery.toLowerCase().trim();
    return projects.filter((project) => {
      // Search in project name
      if (project.name.toLowerCase().includes(query)) return true;
      // Search in location
      if (project.location.toLowerCase().includes(query)) return true;
      // Search in materials
      if (project.materials.some((m) => m.name.toLowerCase().includes(query))) return true;
      // Search in notes
      if (project.notes.toLowerCase().includes(query)) return true;
      return false;
    });
  }, [projects, searchQuery]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-1">Мои объекты</h1>
          <p className="text-muted-foreground">
            {projects.length > 0
              ? `${projects.length} проектов`
              : 'Создайте первый объект'}
          </p>
        </div>

        <button
          onClick={onCreateProject}
          className="btn-icon px-5 py-3 rounded-xl text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 shadow-card"
        >
          <Plus size={20} />
          <span>Новый объект</span>
        </button>
      </div>

      {projects.length > 0 && (
        <SearchFilter
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Поиск по названию, адресу, материалам..."
        />
      )}

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 bg-muted rounded-2xl flex items-center justify-center mb-6">
            <FolderOpen className="w-10 h-10 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Нет объектов
          </h2>
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
      ) : filteredProjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-muted-foreground">
            По запросу "{searchQuery}" ничего не найдено
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onDelete={onDeleteProject}
            />
          ))}
        </div>
      )}
    </div>
  );
};
