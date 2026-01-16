import React, { useState } from 'react';
import { DocumentItem, formatCurrency } from '@/types/documents';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pencil, Check, X } from 'lucide-react';

interface DocumentItemsTableProps {
  items: DocumentItem[];
  total: number;
  onDeleteItem: (id: number) => void;
  onUpdateItem?: (id: number, updates: Partial<DocumentItem>) => void;
}

export const DocumentItemsTable: React.FC<DocumentItemsTableProps> = ({ 
  items, 
  total, 
  onDeleteItem,
  onUpdateItem,
}) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValues, setEditValues] = useState<Partial<DocumentItem>>({});

  const startEditing = (item: DocumentItem) => {
    setEditingId(item.id);
    setEditValues({
      name: item.name,
      quantity: item.quantity,
      price: item.price,
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditValues({});
  };

  const saveEditing = () => {
    if (editingId && onUpdateItem) {
      const price = editValues.price || 0;
      const quantity = editValues.quantity || 0;
      onUpdateItem(editingId, {
        ...editValues,
        total: price * quantity,
      });
    }
    setEditingId(null);
    setEditValues({});
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      saveEditing();
    } else if (e.key === 'Escape') {
      cancelEditing();
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center justify-between">
          <span>Позиции ({items.length})</span>
          <span className="text-primary font-bold">{formatCurrency(total)} ₸</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 max-h-[300px] overflow-auto">
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">
            Добавьте позиции через калькулятор
          </p>
        ) : (
          <table className="w-full text-xs">
            <thead className="bg-muted sticky top-0">
              <tr>
                <th className="px-2 py-1 text-left">Наименование</th>
                <th className="px-2 py-1 text-center w-16">Кол.</th>
                <th className="px-2 py-1 text-right w-16">Цена</th>
                <th className="px-2 py-1 text-right w-20">Сумма</th>
                <th className="w-16"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b hover:bg-muted/30">
                  {editingId === item.id ? (
                    <>
                      <td className="px-1 py-1">
                        <Input
                          value={editValues.name || ''}
                          onChange={(e) => setEditValues(prev => ({ ...prev, name: e.target.value }))}
                          onKeyDown={handleKeyDown}
                          className="h-7 text-xs"
                          autoFocus
                        />
                      </td>
                      <td className="px-1 py-1">
                        <Input
                          type="number"
                          value={editValues.quantity || ''}
                          onChange={(e) => setEditValues(prev => ({ ...prev, quantity: parseFloat(e.target.value) || 0 }))}
                          onKeyDown={handleKeyDown}
                          className="h-7 text-xs text-center"
                          min={0}
                        />
                      </td>
                      <td className="px-1 py-1">
                        <Input
                          type="number"
                          value={editValues.price || ''}
                          onChange={(e) => setEditValues(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                          onKeyDown={handleKeyDown}
                          className="h-7 text-xs text-right"
                          min={0}
                        />
                      </td>
                      <td className="px-2 py-1 text-right font-medium text-muted-foreground">
                        {formatCurrency((editValues.price || 0) * (editValues.quantity || 0))}
                      </td>
                      <td className="px-1 py-1">
                        <div className="flex gap-0.5">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-green-600 hover:text-green-700"
                            onClick={saveEditing}
                          >
                            <Check className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-muted-foreground hover:text-foreground"
                            onClick={cancelEditing}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td 
                        className="px-2 py-1.5 truncate max-w-[120px] cursor-pointer hover:text-primary" 
                        title={item.name}
                        onClick={() => onUpdateItem && startEditing(item)}
                      >
                        {item.name}
                      </td>
                      <td 
                        className="px-2 py-1.5 text-center cursor-pointer hover:text-primary"
                        onClick={() => onUpdateItem && startEditing(item)}
                      >
                        {item.quantity}
                      </td>
                      <td 
                        className="px-2 py-1.5 text-right cursor-pointer hover:text-primary"
                        onClick={() => onUpdateItem && startEditing(item)}
                      >
                        {formatCurrency(item.price)}
                      </td>
                      <td className="px-2 py-1.5 text-right font-medium">
                        {formatCurrency(item.total)}
                      </td>
                      <td className="px-1 py-1">
                        <div className="flex gap-0.5">
                          {onUpdateItem && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-muted-foreground hover:text-primary"
                              onClick={() => startEditing(item)}
                            >
                              <Pencil className="h-3 w-3" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-destructive"
                            onClick={() => onDeleteItem(item.id)}
                          >
                            ×
                          </Button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </CardContent>
    </Card>
  );
};
