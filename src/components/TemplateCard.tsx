import React from 'react';
import { LayoutTemplate, Trash2, Package } from 'lucide-react';
import { Template } from '@/types';

interface TemplateCardProps {
  template: Template;
  onDelete: (id: number) => void;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({ template, onDelete }) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Удалить шаблон "${template.name}"?`)) {
      onDelete(template.id);
    }
  };

  const previewMaterials = template.materials.slice(0, 3);

  return (
    <div className="bg-card rounded-xl p-5 shadow-card card-hover group animate-fade-in">
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
          <LayoutTemplate className="w-6 h-6 text-accent" />
        </div>
        <button
          onClick={handleDelete}
          className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-all duration-200"
        >
          <Trash2 size={18} />
        </button>
      </div>

      <h3 className="text-lg font-semibold text-foreground mb-2">
        {template.name}
      </h3>

      <span className="inline-block text-xs text-muted-foreground px-2 py-1 bg-muted rounded-full mb-4">
        {template.category}
      </span>

      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <Package size={14} />
        <span>{template.materials.length} позиций</span>
      </div>

      <div className="pt-4 border-t border-border space-y-2">
        {previewMaterials.map((m) => (
          <p key={m.id} className="text-sm text-muted-foreground truncate">
            • {m.name}
          </p>
        ))}
        {template.materials.length > 3 && (
          <p className="text-sm text-accent">
            и ещё {template.materials.length - 3}...
          </p>
        )}
      </div>
    </div>
  );
};
