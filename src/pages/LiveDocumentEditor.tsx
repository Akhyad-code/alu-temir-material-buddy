import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calculator, 
  Square, 
  Box, 
  Plus,
  FileText,
  Receipt,
  Printer,
  ArrowLeft,
  RotateCcw,
  Layers
} from 'lucide-react';
import { 
  CommercialProposal, 
  Invoice, 
  DocumentItem,
  DEFAULT_COMPANY_INFO,
  formatCurrency 
} from '@/types/documents';
import { CommercialProposalPreview } from '@/components/documents/CommercialProposalPreview';
import { InvoicePreview } from '@/components/documents/InvoicePreview';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { toast } from 'sonner';

type DocumentType = CommercialProposal | Invoice;

const createNewKP = (): CommercialProposal => ({
  id: Date.now(),
  type: 'kp',
  number: '1',
  date: new Date().toLocaleDateString('ru-RU'),
  city: 'г. Алматы',
  client: { name: '', address: '' },
  items: [],
  notes: '',
});

const createNewInvoice = (): Invoice => ({
  id: Date.now(),
  type: 'invoice',
  number: '1',
  date: new Date().toLocaleDateString('ru-RU'),
  supplier: { ...DEFAULT_COMPANY_INFO },
  buyer: { name: '', address: '' },
  items: [],
  includeVAT: true,
  vatRate: 12,
});

export const LiveDocumentEditor: React.FC = () => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useLocalStorage<DocumentType[]>('alu-temir-documents', []);
  
  // Document state
  const [documentType, setDocumentType] = useState<'kp' | 'invoice'>('kp');
  const [currentDocument, setCurrentDocument] = useState<DocumentType>(createNewKP());
  
  // Calculator state
  const [calcTab, setCalcTab] = useState<'area' | 'material' | 'manual'>('manual');
  
  // Area calc
  const [areaLength, setAreaLength] = useState('');
  const [areaWidth, setAreaWidth] = useState('');
  const [areaResult, setAreaResult] = useState<number | null>(null);
  
  // Material calc
  const [materialName, setMaterialName] = useState('');
  const [materialUnit, setMaterialUnit] = useState('м.п');
  const [materialPrice, setMaterialPrice] = useState('');
  const [materialQty, setMaterialQty] = useState('');
  
  // Switch document type
  const handleDocumentTypeChange = (type: 'kp' | 'invoice') => {
    setDocumentType(type);
    setCurrentDocument(type === 'kp' ? createNewKP() : createNewInvoice());
  };
  
  // Calculate area
  const calculateArea = () => {
    const l = parseFloat(areaLength);
    const w = parseFloat(areaWidth);
    if (!isNaN(l) && !isNaN(w)) {
      setAreaResult(l * w);
      setMaterialQty((l * w).toFixed(2));
    }
  };
  
  // Add item to document
  const addItemToDocument = useCallback(() => {
    if (!materialName.trim()) {
      toast.error('Введите наименование');
      return;
    }
    
    const price = parseFloat(materialPrice) || 0;
    const qty = parseFloat(materialQty) || 1;
    
    const newItem: DocumentItem = {
      id: Date.now(),
      name: materialName,
      size: '',
      unit: materialUnit,
      price: price,
      quantity: qty,
      total: price * qty,
    };
    
    setCurrentDocument(prev => ({
      ...prev,
      items: [...prev.items, newItem],
    }));
    
    // Reset form
    setMaterialName('');
    setMaterialPrice('');
    setMaterialQty('');
    setAreaResult(null);
    setAreaLength('');
    setAreaWidth('');
    
    toast.success('Позиция добавлена');
  }, [materialName, materialUnit, materialPrice, materialQty]);
  
  // Update item
  const updateItem = (id: number, field: keyof DocumentItem, value: string | number) => {
    setCurrentDocument(prev => ({
      ...prev,
      items: prev.items.map(item => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          if (field === 'price' || field === 'quantity') {
            updated.total = updated.price * updated.quantity;
          }
          return updated;
        }
        return item;
      }),
    }));
  };
  
  // Delete item
  const deleteItem = (id: number) => {
    setCurrentDocument(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id),
    }));
  };
  
  // Save document
  const saveDocument = () => {
    const updatedDoc = { ...currentDocument, id: Date.now() };
    setDocuments([updatedDoc, ...documents]);
    toast.success('Документ сохранён');
  };
  
  // Print
  const handlePrint = () => {
    window.print();
  };
  
  const total = currentDocument.items.reduce((sum, item) => sum + item.total, 0);

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-card no-print">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/documents')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            К документам
          </Button>
          
          <div className="flex items-center gap-2 border-l pl-4">
            <Button
              variant={documentType === 'kp' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleDocumentTypeChange('kp')}
            >
              <FileText className="h-4 w-4 mr-1" />
              КП
            </Button>
            <Button
              variant={documentType === 'invoice' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleDocumentTypeChange('invoice')}
            >
              <Receipt className="h-4 w-4 mr-1" />
              Счёт
            </Button>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={saveDocument}>
            Сохранить
          </Button>
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Печать
          </Button>
        </div>
      </div>

      {/* Main content - Calculator + Preview */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Calculator */}
        <div className="w-[420px] border-r border-border bg-card overflow-auto no-print">
          <div className="p-4 space-y-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Calculator className="h-5 w-5 text-primary" />
              Калькулятор
            </h2>
            
            <Tabs value={calcTab} onValueChange={(v) => setCalcTab(v as any)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="manual">Вручную</TabsTrigger>
                <TabsTrigger value="area">Площадь</TabsTrigger>
                <TabsTrigger value="material">Профиль</TabsTrigger>
              </TabsList>
              
              {/* Manual Entry */}
              <TabsContent value="manual" className="space-y-4 mt-4">
                <div className="space-y-3">
                  <div>
                    <Label>Наименование</Label>
                    <Input
                      value={materialName}
                      onChange={(e) => setMaterialName(e.target.value)}
                      placeholder="Металлический реечный профиль V30x75..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Ед. изм.</Label>
                      <Select value={materialUnit} onValueChange={setMaterialUnit}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="м.п">м.п</SelectItem>
                          <SelectItem value="шт">шт</SelectItem>
                          <SelectItem value="м²">м²</SelectItem>
                          <SelectItem value="упак">упак</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Количество</Label>
                      <Input
                        type="number"
                        value={materialQty}
                        onChange={(e) => setMaterialQty(e.target.value)}
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Цена за ед. (тг)</Label>
                    <Input
                      type="number"
                      value={materialPrice}
                      onChange={(e) => setMaterialPrice(e.target.value)}
                      placeholder="0"
                    />
                  </div>
                  
                  {materialQty && materialPrice && (
                    <div className="p-3 bg-muted rounded-lg">
                      <div className="text-sm text-muted-foreground">Сумма:</div>
                      <div className="text-xl font-bold">
                        {formatCurrency(parseFloat(materialQty || '0') * parseFloat(materialPrice || '0'))} ₸
                      </div>
                    </div>
                  )}
                  
                  <Button className="w-full" onClick={addItemToDocument}>
                    <Plus className="h-4 w-4 mr-2" />
                    Добавить в документ
                  </Button>
                </div>
              </TabsContent>
              
              {/* Area Calculator */}
              <TabsContent value="area" className="space-y-4 mt-4">
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Длина (м)</Label>
                      <Input
                        type="number"
                        value={areaLength}
                        onChange={(e) => setAreaLength(e.target.value)}
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <Label>Ширина (м)</Label>
                      <Input
                        type="number"
                        value={areaWidth}
                        onChange={(e) => setAreaWidth(e.target.value)}
                        placeholder="0"
                      />
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full" 
                    variant="secondary"
                    onClick={calculateArea}
                    disabled={!areaLength || !areaWidth}
                  >
                    <Square className="h-4 w-4 mr-2" />
                    Рассчитать площадь
                  </Button>
                  
                  {areaResult !== null && (
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <div className="text-sm text-muted-foreground">Площадь:</div>
                      <div className="text-xl font-bold text-primary">
                        {areaResult.toFixed(2)} м²
                      </div>
                    </div>
                  )}
                  
                  <div className="border-t pt-3 space-y-3">
                    <div>
                      <Label>Наименование материала</Label>
                      <Input
                        value={materialName}
                        onChange={(e) => setMaterialName(e.target.value)}
                        placeholder="Потолочная рейка V30x75..."
                      />
                    </div>
                    <div>
                      <Label>Цена за м² (тг)</Label>
                      <Input
                        type="number"
                        value={materialPrice}
                        onChange={(e) => setMaterialPrice(e.target.value)}
                        placeholder="0"
                      />
                    </div>
                    
                    <Button className="w-full" onClick={() => {
                      setMaterialUnit('м²');
                      addItemToDocument();
                    }}>
                      <Plus className="h-4 w-4 mr-2" />
                      Добавить площадь в документ
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              {/* Profile Calculator */}
              <TabsContent value="material" className="space-y-4 mt-4">
                <div className="space-y-3">
                  <div>
                    <Label>Наименование профиля</Label>
                    <Input
                      value={materialName}
                      onChange={(e) => setMaterialName(e.target.value)}
                      placeholder="Крепежный профиль V93 L-3,02m..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Количество</Label>
                      <Input
                        type="number"
                        value={materialQty}
                        onChange={(e) => setMaterialQty(e.target.value)}
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <Label>Ед. изм.</Label>
                      <Select value={materialUnit} onValueChange={setMaterialUnit}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="м.п">м.п</SelectItem>
                          <SelectItem value="шт">шт</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label>Цена за единицу (тг)</Label>
                    <Input
                      type="number"
                      value={materialPrice}
                      onChange={(e) => setMaterialPrice(e.target.value)}
                      placeholder="0"
                    />
                  </div>
                  
                  {materialQty && materialPrice && (
                    <div className="p-3 bg-muted rounded-lg">
                      <div className="text-sm text-muted-foreground">Сумма:</div>
                      <div className="text-xl font-bold">
                        {formatCurrency(parseFloat(materialQty || '0') * parseFloat(materialPrice || '0'))} ₸
                      </div>
                    </div>
                  )}
                  
                  <Button className="w-full" onClick={addItemToDocument}>
                    <Plus className="h-4 w-4 mr-2" />
                    Добавить профиль
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
            
            {/* Items List */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center justify-between">
                  <span>Позиции ({currentDocument.items.length})</span>
                  <span className="text-primary font-bold">{formatCurrency(total)} ₸</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 max-h-[300px] overflow-auto">
                {currentDocument.items.length === 0 ? (
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
                      {currentDocument.items.map((item) => (
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
                              onClick={() => deleteItem(item.id)}
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
            
            {/* Client Info */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Клиент</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-xs">Название / ФИО</Label>
                  <Input
                    value={documentType === 'kp' 
                      ? (currentDocument as CommercialProposal).client.name 
                      : (currentDocument as Invoice).buyer.name
                    }
                    onChange={(e) => {
                      if (documentType === 'kp') {
                        setCurrentDocument(prev => ({
                          ...prev,
                          client: { ...(prev as CommercialProposal).client, name: e.target.value }
                        } as CommercialProposal));
                      } else {
                        setCurrentDocument(prev => ({
                          ...prev,
                          buyer: { ...(prev as Invoice).buyer, name: e.target.value }
                        } as Invoice));
                      }
                    }}
                    placeholder="ТОО / ИП название"
                    className="h-8 text-sm"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Panel - Live Preview */}
        <div className="flex-1 bg-muted/30 overflow-auto p-6 print:p-0 print:bg-white">
          <div className="print:shadow-none">
            {documentType === 'kp' ? (
              <CommercialProposalPreview document={currentDocument as CommercialProposal} />
            ) : (
              <InvoicePreview document={currentDocument as Invoice} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
