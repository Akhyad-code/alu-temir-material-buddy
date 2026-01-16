import React from 'react';
import { Ruler } from 'lucide-react';
import { CommercialProposal, ProfileDimensions } from '@/types/documents';
import { DEFAULT_DIMENSIONS } from './ProfileDiagrams';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';

interface DiagramSettingsPanelProps {
  document: CommercialProposal;
  onUpdate: (document: CommercialProposal) => void;
}

export const DiagramSettingsPanel: React.FC<DiagramSettingsPanelProps> = ({ 
  document, 
  onUpdate 
}) => {
  const dimensions = document.diagramDimensions || DEFAULT_DIMENSIONS;

  const updateDimension = (field: keyof ProfileDimensions, value: number) => {
    onUpdate({
      ...document,
      diagramDimensions: {
        ...dimensions,
        [field]: value,
      },
    });
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Ruler className="h-4 w-4" />
          Чертёж профиля
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-xs">Показать чертёж</Label>
          <Switch
            checked={document.showDiagram || false}
            onCheckedChange={(checked) => {
              onUpdate({
                ...document,
                showDiagram: checked,
              });
            }}
          />
        </div>
        
        {document.showDiagram && (
          <>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <Label className="text-xs">Ширина (мм)</Label>
                <Input
                  type="number"
                  value={dimensions.width}
                  onChange={(e) => updateDimension('width', parseInt(e.target.value) || 59)}
                  className="h-8 text-sm"
                  min={10}
                  max={200}
                />
              </div>
              <div>
                <Label className="text-xs">Высота (мм)</Label>
                <Input
                  type="number"
                  value={dimensions.height}
                  onChange={(e) => updateDimension('height', parseInt(e.target.value) || 43)}
                  className="h-8 text-sm"
                  min={10}
                  max={200}
                />
              </div>
              <div>
                <Label className="text-xs">Зазор (мм)</Label>
                <Input
                  type="number"
                  value={dimensions.gap}
                  onChange={(e) => updateDimension('gap', parseInt(e.target.value) || 40)}
                  className="h-8 text-sm"
                  min={5}
                  max={100}
                />
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground">
              Профиль V{dimensions.width}x{dimensions.height}
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
};
