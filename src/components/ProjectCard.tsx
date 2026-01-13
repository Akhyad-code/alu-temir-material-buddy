import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, MapPin, Calendar, Package, Paperclip, Trash2 } from 'lucide-react';
import { Project } from '@/types';

interface ProjectCardProps {
  project: Project;
  onDelete: (id: number) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onDelete }) => {
  const navigate = useNavigate();

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Удалить объект "${project.name}"?`)) {
      onDelete(project.id);
    }
  };

  return (
    <div
      onClick={() => navigate(`/project/${project.id}`)}
      className="bg-card rounded-xl p-5 shadow-card card-hover cursor-pointer group animate-fade-in"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
          <Building2 className="w-6 h-6 text-primary" />
        </div>
        <button
          onClick={handleDelete}
          className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-all duration-200"
        >
          <Trash2 size={18} />
        </button>
      </div>

      <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-1">
        {project.name}
      </h3>

      {project.location && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <MapPin size={14} />
          <span className="line-clamp-1">{project.location}</span>
        </div>
      )}

      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <Calendar size={14} />
        <span>{project.date}</span>
      </div>

      <div className="flex items-center gap-4 pt-4 border-t border-border">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Package size={14} />
          <span>{project.materials.length} позиций</span>
        </div>
        {project.files.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-purple">
            <Paperclip size={14} />
            <span>{project.files.length} файлов</span>
          </div>
        )}
      </div>
    </div>
  );
};
