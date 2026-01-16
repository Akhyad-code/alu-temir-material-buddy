import React from 'react';
import { DocumentItem, formatCurrency } from '@/types/documents';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DocumentItemsTableProps {
  items: DocumentItem[];
  total: number;
  onDeleteItem: (id: number) => void;
}

export const DocumentItemsTable: React.FC<DocumentItemsTableProps> = ({ 
  items, 
  total, 
  onDeleteItem 
}) => {
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
                <th className="px-2 py-1 text-center w-12">Кол.</th>
                <th className="px-2 py-1 text-right w-20">Сумма</th>
                <th className="w-8"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b hover:bg-muted/30">
                  <td className="px-2 py-1.5 truncate max-w-[150px]" title={item.name}>
                    {item.name}
                  </td>
                  <td className="px-2 py-1.5 text-center">{item.quantity}</td>
                  <td className="px-2 py-1.5 text-right font-medium">
                    {formatCurrency(item.total)}
                  </td>
                  <td className="px-1 py-1.5">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-destructive"
                      onClick={() => onDeleteItem(item.id)}
                    >
                      ×
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </CardContent>
    </Card>
  );
};
