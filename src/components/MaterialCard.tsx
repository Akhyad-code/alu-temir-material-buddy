import React from 'react';
import { Pencil, Trash2, Package } from 'lucide-react';
import { Material } from '@/types';

interface MaterialCardProps {
  material: Material;
  onEdit: () => void;
  onDelete: () => void;
}

export const MaterialCard: React.FC<MaterialCardProps> = ({ material, onEdit, onDelete }) => {
  const handleDelete = () => {
    if (window.confirm(`Удалить "${material.name}"?`)) {
      onDelete();
    }
  };

  return (
    <div className="bg-card rounded-xl p-4 shadow-card group animate-fade-in">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
            <Package className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h4 className="font-medium text-foreground">{material.name}</h4>
            <span className="text-xs text-muted-foreground px-2 py-0.5 bg-muted rounded-full">
              {material.category}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={onEdit}
            className="p-2 rounded-lg text-muted-foreground hover:text-accent hover:bg-accent/10 transition-colors"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Кол-во:</span>
          <span className="font-medium text-foreground">
            {material.quantity || '—'} {material.quantity && material.unit}
          </span>
        </div>
      </div>

      {material.notes && (
        <p className="mt-3 text-sm text-muted-foreground border-t border-border pt-3">
          {material.notes}
        </p>
      )}
    </div>
  );
};
