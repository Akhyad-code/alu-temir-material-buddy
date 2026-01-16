import React, { useState, useCallback } from 'react';
import { 
  Calculator, 
  Square, 
  Plus,
} from 'lucide-react';
import { DocumentItem, formatCurrency } from '@/types/documents';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

interface CalculatorPanelProps {
  onAddItem: (item: DocumentItem) => void;
}

export const CalculatorPanel: React.FC<CalculatorPanelProps> = ({ onAddItem }) => {
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
    
    onAddItem(newItem);
    
    // Reset form
    setMaterialName('');
    setMaterialPrice('');
    setMaterialQty('');
    setAreaResult(null);
    setAreaLength('');
    setAreaWidth('');
    
    toast.success('Позиция добавлена');
  }, [materialName, materialUnit, materialPrice, materialQty, onAddItem]);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold flex items-center gap-2">
        <Calculator className="h-5 w-5 text-primary" />
        Калькулятор
      </h2>
      
      <Tabs value={calcTab} onValueChange={(v) => setCalcTab(v as 'area' | 'material' | 'manual')}>
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
    </div>
  );
};
