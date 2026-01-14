import React from 'react';
import { DocumentItem, formatCurrency } from '@/types/documents';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface DocumentItemRowProps {
  item: DocumentItem;
  index: number;
  onUpdate: (id: number, field: keyof DocumentItem, value: string | number) => void;
  onDelete: (id: number) => void;
  readOnly?: boolean;
}

export const DocumentItemRow: React.FC<DocumentItemRowProps> = ({
  item,
  index,
  onUpdate,
  onDelete,
  readOnly = false,
}) => {
  const handleChange = (field: keyof DocumentItem, value: string) => {
    if (field === 'price' || field === 'quantity') {
      const numValue = parseFloat(value) || 0;
      onUpdate(item.id, field, numValue);
    } else {
      onUpdate(item.id, field, value);
    }
  };

  if (readOnly) {
    return (
      <tr className="border-b border-border">
        <td className="px-2 py-1.5 text-center text-sm">{index + 1}</td>
        <td className="px-2 py-1.5 text-sm">{item.name}</td>
        <td className="px-2 py-1.5 text-center text-sm">{item.size || '-'}</td>
        <td className="px-2 py-1.5 text-center text-sm">{item.unit}</td>
        <td className="px-2 py-1.5 text-right text-sm">{formatCurrency(item.price)}</td>
        <td className="px-2 py-1.5 text-center text-sm">{item.quantity}</td>
        <td className="px-2 py-1.5 text-right text-sm font-medium">{formatCurrency(item.total)}</td>
      </tr>
    );
  }

  return (
    <tr className="border-b border-border group hover:bg-muted/30">
      <td className="px-2 py-1.5 text-center text-sm text-muted-foreground">{index + 1}</td>
      <td className="px-1 py-1">
        <Input
          value={item.name}
          onChange={(e) => handleChange('name', e.target.value)}
          className="h-8 text-sm"
          placeholder="Наименование"
        />
      </td>
      <td className="px-1 py-1">
        <Input
          value={item.size || ''}
          onChange={(e) => handleChange('size', e.target.value)}
          className="h-8 text-sm text-center w-20"
          placeholder="-"
        />
      </td>
      <td className="px-1 py-1">
        <Input
          value={item.unit}
          onChange={(e) => handleChange('unit', e.target.value)}
          className="h-8 text-sm text-center w-16"
          placeholder="шт"
        />
      </td>
      <td className="px-1 py-1">
        <Input
          type="number"
          value={item.price || ''}
          onChange={(e) => handleChange('price', e.target.value)}
          className="h-8 text-sm text-right w-24"
          placeholder="0.00"
        />
      </td>
      <td className="px-1 py-1">
        <Input
          type="number"
          value={item.quantity || ''}
          onChange={(e) => handleChange('quantity', e.target.value)}
          className="h-8 text-sm text-center w-20"
          placeholder="0"
        />
      </td>
      <td className="px-2 py-1.5 text-right text-sm font-medium">
        {formatCurrency(item.total)}
      </td>
      <td className="px-1 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-destructive hover:text-destructive"
          onClick={() => onDelete(item.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </td>
    </tr>
  );
};
