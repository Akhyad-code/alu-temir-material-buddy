import React, { useState } from 'react';
import { TEMPLATE_CATEGORIES } from '@/types';

interface TemplateFormProps {
  onSave: (name: string, category: string) => void;
  onCancel: () => void;
}

export const TemplateForm: React.FC<TemplateFormProps> = ({ onSave, onCancel }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Другое');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Введите название шаблона');
      return;
    }
    onSave(name.trim(), category);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">
          Название шаблона <span className="text-destructive">*</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Например: Стандартный потолок"
          className="input-field"
          autoFocus
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">
          Категория
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="input-field"
        >
          {TEMPLATE_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2.5 rounded-lg text-sm font-medium bg-muted text-foreground hover:bg-muted/80 transition-colors"
        >
          Отмена
        </button>
        <button
          type="submit"
          className="px-4 py-2.5 rounded-lg text-sm font-medium bg-accent text-accent-foreground hover:bg-accent/90 transition-colors"
        >
          Сохранить шаблон
        </button>
      </div>
    </form>
  );
};
