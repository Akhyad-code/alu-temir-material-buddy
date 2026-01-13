import React from 'react';
import { LayoutTemplate } from 'lucide-react';
import { TemplateCard } from '@/components/TemplateCard';
import { Template } from '@/types';

interface TemplatesPageProps {
  templates: Template[];
  onDeleteTemplate: (id: number) => void;
}

export const TemplatesPage: React.FC<TemplatesPageProps> = ({
  templates,
  onDeleteTemplate,
}) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-1">
          Библиотека шаблонов
        </h1>
        <p className="text-muted-foreground">
          {templates.length > 0
            ? `${templates.length} шаблонов`
            : 'Сохраняйте наборы материалов как шаблоны для быстрого использования'}
        </p>
      </div>

      {templates.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 bg-muted rounded-2xl flex items-center justify-center mb-6">
            <LayoutTemplate className="w-10 h-10 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Нет шаблонов
          </h2>
          <p className="text-muted-foreground max-w-md">
            Создайте проект с материалами и сохраните его как шаблон для быстрого использования в будущих объектах
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onDelete={onDeleteTemplate}
            />
          ))}
        </div>
      )}
    </div>
  );
};
