import React, { useState, useCallback } from 'react';
import { CommercialProposal, Invoice, DocumentItem, DEFAULT_COMPANY_INFO, formatCurrency, ProfileDimensions } from '@/types/documents';
import { Project } from '@/types';
import { DocumentItemRow } from './DocumentItemRow';
import { ImportFromProject } from './ImportFromProject';
import { DEFAULT_DIMENSIONS } from './ProfileDiagrams';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Building2, User, FileText, Ruler } from 'lucide-react';

interface DocumentEditorProps {
  document: CommercialProposal | Invoice;
  onUpdate: (doc: CommercialProposal | Invoice) => void;
  projects?: Project[];
}

export const DocumentEditor: React.FC<DocumentEditorProps> = ({ document, onUpdate, projects = [] }) => {
  const isInvoice = document.type === 'invoice';

  const handleImportItems = (items: DocumentItem[]) => {
    onUpdate({
      ...document,
      items: [...document.items, ...items],
    });
  };

  const handleAddItem = () => {
    const newItem: DocumentItem = {
      id: Date.now(),
      name: '',
      size: '',
      unit: 'шт',
      price: 0,
      quantity: 1,
      total: 0,
    };
    onUpdate({
      ...document,
      items: [...document.items, newItem],
    });
  };

  const handleUpdateItem = (id: number, field: keyof DocumentItem, value: string | number) => {
    const updatedItems = document.items.map((item) => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        // Recalculate total
        updated.total = updated.price * updated.quantity;
        return updated;
      }
      return item;
    });
    onUpdate({ ...document, items: updatedItems });
  };

  const handleDeleteItem = (id: number) => {
    onUpdate({
      ...document,
      items: document.items.filter((item) => item.id !== id),
    });
  };

  const total = document.items.reduce((sum, item) => sum + item.total, 0);

  return (
    <div className="space-y-4 h-full overflow-auto p-4">
      <Tabs defaultValue="items" className="w-full">
        <TabsList className={`grid w-full ${isInvoice ? 'grid-cols-3' : 'grid-cols-4'}`}>
          <TabsTrigger value="items" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Позиции
          </TabsTrigger>
          <TabsTrigger value="details" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Реквизиты
          </TabsTrigger>
          <TabsTrigger value="client" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Клиент
          </TabsTrigger>
          {!isInvoice && (
            <TabsTrigger value="diagram" className="flex items-center gap-2">
              <Ruler className="h-4 w-4" />
              Чертёж
            </TabsTrigger>
          )}
        </TabsList>

        {/* Items Tab */}
        <TabsContent value="items" className="space-y-4 mt-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <CardTitle className="text-lg">Товары/Услуги</CardTitle>
                <div className="flex items-center gap-2">
                  {projects.length > 0 && (
                    <ImportFromProject projects={projects} onImport={handleImportItems} />
                  )}
                  <Button size="sm" onClick={handleAddItem}>
                    <Plus className="h-4 w-4 mr-1" />
                    Добавить
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-muted text-muted-foreground text-xs">
                      <th className="px-2 py-2 text-center w-10">№</th>
                      <th className="px-2 py-2 text-left">Наименование</th>
                      <th className="px-2 py-2 text-center w-20">Размер</th>
                      <th className="px-2 py-2 text-center w-16">Ед.</th>
                      <th className="px-2 py-2 text-right w-24">Цена</th>
                      <th className="px-2 py-2 text-center w-20">Кол-во</th>
                      <th className="px-2 py-2 text-right w-28">Сумма</th>
                      <th className="w-10"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {document.items.map((item, index) => (
                      <DocumentItemRow
                        key={item.id}
                        item={item}
                        index={index}
                        onUpdate={handleUpdateItem}
                        onDelete={handleDeleteItem}
                      />
                    ))}
                    {document.items.length === 0 && (
                      <tr>
                        <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                          Нажмите "Добавить" чтобы добавить первую позицию
                        </td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot>
                    <tr className="bg-muted/50 font-medium">
                      <td colSpan={6} className="px-2 py-2 text-right">Итого:</td>
                      <td className="px-2 py-2 text-right">{formatCurrency(total)}</td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Примечания</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={document.notes || ''}
                onChange={(e) => onUpdate({ ...document, notes: e.target.value })}
                placeholder="Дополнительные условия, примечания..."
                rows={3}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Details Tab */}
        <TabsContent value="details" className="space-y-4 mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Данные документа</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Номер документа</Label>
                  <Input
                    value={document.number}
                    onChange={(e) => onUpdate({ ...document, number: e.target.value })}
                    placeholder="1"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Дата</Label>
                  <Input
                    value={document.date}
                    onChange={(e) => onUpdate({ ...document, date: e.target.value })}
                    placeholder="01.01.2025"
                  />
                </div>
              </div>

              {!isInvoice && (
                <div className="space-y-2">
                  <Label>Город</Label>
                  <Input
                    value={(document as CommercialProposal).city}
                    onChange={(e) => onUpdate({ ...document, city: e.target.value } as CommercialProposal)}
                    placeholder="г. Алматы"
                  />
                </div>
              )}

              {isInvoice && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>№ Договора</Label>
                      <Input
                        value={(document as Invoice).contractNumber || ''}
                        onChange={(e) => onUpdate({ ...document, contractNumber: e.target.value } as Invoice)}
                        placeholder="1"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Дата договора</Label>
                      <Input
                        value={(document as Invoice).contractDate || ''}
                        onChange={(e) => onUpdate({ ...document, contractDate: e.target.value } as Invoice)}
                        placeholder="01.01.2025"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <Label>Включить НДС</Label>
                    <Switch
                      checked={(document as Invoice).includeVAT}
                      onCheckedChange={(checked) => onUpdate({ ...document, includeVAT: checked } as Invoice)}
                    />
                  </div>

                  {(document as Invoice).includeVAT && (
                    <div className="space-y-2">
                      <Label>Ставка НДС (%)</Label>
                      <Input
                        type="number"
                        value={(document as Invoice).vatRate}
                        onChange={(e) => onUpdate({ ...document, vatRate: parseFloat(e.target.value) || 12 } as Invoice)}
                        placeholder="12"
                      />
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {isInvoice && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Реквизиты поставщика</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Название компании</Label>
                  <Input
                    value={(document as Invoice).supplier.name}
                    onChange={(e) => onUpdate({ 
                      ...document, 
                      supplier: { ...(document as Invoice).supplier, name: e.target.value }
                    } as Invoice)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>БИН</Label>
                    <Input
                      value={(document as Invoice).supplier.bin}
                      onChange={(e) => onUpdate({ 
                        ...document, 
                        supplier: { ...(document as Invoice).supplier, bin: e.target.value }
                      } as Invoice)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Телефон</Label>
                    <Input
                      value={(document as Invoice).supplier.phone}
                      onChange={(e) => onUpdate({ 
                        ...document, 
                        supplier: { ...(document as Invoice).supplier, phone: e.target.value }
                      } as Invoice)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Адрес</Label>
                  <Input
                    value={(document as Invoice).supplier.address}
                    onChange={(e) => onUpdate({ 
                      ...document, 
                      supplier: { ...(document as Invoice).supplier, address: e.target.value }
                    } as Invoice)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Банк</Label>
                    <Input
                      value={(document as Invoice).supplier.bank}
                      onChange={(e) => onUpdate({ 
                        ...document, 
                        supplier: { ...(document as Invoice).supplier, bank: e.target.value }
                      } as Invoice)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>IBAN</Label>
                    <Input
                      value={(document as Invoice).supplier.iban}
                      onChange={(e) => onUpdate({ 
                        ...document, 
                        supplier: { ...(document as Invoice).supplier, iban: e.target.value }
                      } as Invoice)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Client Tab */}
        <TabsContent value="client" className="space-y-4 mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">
                {isInvoice ? 'Покупатель' : 'Клиент'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Название / ФИО</Label>
                <Input
                  value={isInvoice ? (document as Invoice).buyer.name : (document as CommercialProposal).client.name}
                  onChange={(e) => {
                    if (isInvoice) {
                      onUpdate({ 
                        ...document, 
                        buyer: { ...(document as Invoice).buyer, name: e.target.value }
                      } as Invoice);
                    } else {
                      onUpdate({ 
                        ...document, 
                        client: { ...(document as CommercialProposal).client, name: e.target.value }
                      } as CommercialProposal);
                    }
                  }}
                  placeholder="ТОО или ИП название"
                />
              </div>

              <div className="space-y-2">
                <Label>БИН / ИИН</Label>
                <Input
                  value={isInvoice ? (document as Invoice).buyer.bin || '' : (document as CommercialProposal).client.bin || ''}
                  onChange={(e) => {
                    if (isInvoice) {
                      onUpdate({ 
                        ...document, 
                        buyer: { ...(document as Invoice).buyer, bin: e.target.value }
                      } as Invoice);
                    } else {
                      onUpdate({ 
                        ...document, 
                        client: { ...(document as CommercialProposal).client, bin: e.target.value }
                      } as CommercialProposal);
                    }
                  }}
                  placeholder="123456789012"
                />
              </div>

              <div className="space-y-2">
                <Label>Адрес</Label>
                <Textarea
                  value={isInvoice ? (document as Invoice).buyer.address : (document as CommercialProposal).client.address}
                  onChange={(e) => {
                    if (isInvoice) {
                      onUpdate({ 
                        ...document, 
                        buyer: { ...(document as Invoice).buyer, address: e.target.value }
                      } as Invoice);
                    } else {
                      onUpdate({ 
                        ...document, 
                        client: { ...(document as CommercialProposal).client, address: e.target.value }
                      } as CommercialProposal);
                    }
                  }}
                  placeholder="Полный адрес"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label>Телефон</Label>
                <Input
                  value={isInvoice ? (document as Invoice).buyer.phone || '' : (document as CommercialProposal).client.phone || ''}
                  onChange={(e) => {
                    if (isInvoice) {
                      onUpdate({ 
                        ...document, 
                        buyer: { ...(document as Invoice).buyer, phone: e.target.value }
                      } as Invoice);
                    } else {
                      onUpdate({ 
                        ...document, 
                        client: { ...(document as CommercialProposal).client, phone: e.target.value }
                      } as CommercialProposal);
                    }
                  }}
                  placeholder="+7 XXX XXX XXXX"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Diagram Tab - Only for KP */}
        {!isInvoice && (
          <TabsContent value="diagram" className="space-y-4 mt-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Ruler className="h-5 w-5" />
                  Чертёж профиля
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Показать чертёж в КП</Label>
                  <Switch
                    checked={(document as CommercialProposal).showDiagram || false}
                    onCheckedChange={(checked) => {
                      onUpdate({
                        ...document,
                        showDiagram: checked,
                      } as CommercialProposal);
                    }}
                  />
                </div>
                
                {(document as CommercialProposal).showDiagram && (
                  <>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-2">
                        <Label className="text-sm">Ширина (мм)</Label>
                        <Input
                          type="number"
                          value={(document as CommercialProposal).diagramDimensions?.width || DEFAULT_DIMENSIONS.width}
                          onChange={(e) => {
                            const kpDoc = document as CommercialProposal;
                            onUpdate({
                              ...kpDoc,
                              diagramDimensions: {
                                ...kpDoc.diagramDimensions || DEFAULT_DIMENSIONS,
                                width: parseInt(e.target.value) || DEFAULT_DIMENSIONS.width,
                              },
                            } as CommercialProposal);
                          }}
                          min={10}
                          max={200}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm">Высота (мм)</Label>
                        <Input
                          type="number"
                          value={(document as CommercialProposal).diagramDimensions?.height || DEFAULT_DIMENSIONS.height}
                          onChange={(e) => {
                            const kpDoc = document as CommercialProposal;
                            onUpdate({
                              ...kpDoc,
                              diagramDimensions: {
                                ...kpDoc.diagramDimensions || DEFAULT_DIMENSIONS,
                                height: parseInt(e.target.value) || DEFAULT_DIMENSIONS.height,
                              },
                            } as CommercialProposal);
                          }}
                          min={10}
                          max={200}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm">Зазор (мм)</Label>
                        <Input
                          type="number"
                          value={(document as CommercialProposal).diagramDimensions?.gap || DEFAULT_DIMENSIONS.gap}
                          onChange={(e) => {
                            const kpDoc = document as CommercialProposal;
                            onUpdate({
                              ...kpDoc,
                              diagramDimensions: {
                                ...kpDoc.diagramDimensions || DEFAULT_DIMENSIONS,
                                gap: parseInt(e.target.value) || DEFAULT_DIMENSIONS.gap,
                              },
                            } as CommercialProposal);
                          }}
                          min={5}
                          max={100}
                        />
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Профиль V-{(document as CommercialProposal).diagramDimensions?.width || DEFAULT_DIMENSIONS.width}/
                      {(document as CommercialProposal).diagramDimensions?.height || DEFAULT_DIMENSIONS.height}
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};
