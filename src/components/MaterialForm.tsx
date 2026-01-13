import React, { useState, useEffect } from 'react';
import { Material, UNITS, MATERIAL_CATEGORIES } from '@/types';

interface MaterialFormProps {
  material?: Material | null;
  onSave: (material: Omit<Material, 'id'>) => void;
  onCancel: () => void;
}

export const MaterialForm: React.FC<MaterialFormProps> = ({ material, onSave, onCancel }) => {
  const [name, setName] = useState('');
  const [unit, setUnit] = useState('шт');
  const [quantity, setQuantity] = useState('');
  const [category, setCategory] = useState('Другое');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (material) {
      setName(material.name);
      setUnit(material.unit);
      setQuantity(material.quantity);
      setCategory(material.category);
      setNotes(material.notes);
    }
  }, [material]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Введите название материала');
      return;
    }
    onSave({ name: name.trim(), unit, quantity, category, notes });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">
          Название <span className="text-destructive">*</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Например: Реечный профиль V-26/43"
          className="input-field"
          autoFocus
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            Единица измерения
          </label>
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="input-field"
          >
            {UNITS.map((u) => (
              <option key={u.value} value={u.value}>
                {u.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            Количество
          </label>
          <input
            type="text"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="—"
            className="input-field"
          />
        </div>
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
          {MATERIAL_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">
          Примечания
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Дополнительная информация..."
          rows={3}
          className="input-field resize-none"
        />
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
          className="px-4 py-2.5 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          {material ? 'Сохранить' : 'Добавить'}
        </button>
      </div>
    </form>
  );
};
