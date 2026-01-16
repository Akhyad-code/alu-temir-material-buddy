import React from 'react';
import { CommercialProposal, Invoice } from '@/types/documents';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type DocumentType = CommercialProposal | Invoice;

interface ClientInfoPanelProps {
  documentType: 'kp' | 'invoice';
  document: DocumentType;
  onUpdate: (document: DocumentType) => void;
}

export const ClientInfoPanel: React.FC<ClientInfoPanelProps> = ({ 
  documentType, 
  document, 
  onUpdate 
}) => {
  const getClientValue = (field: 'name' | 'bin' | 'address' | 'phone' | 'contactPerson') => {
    if (documentType === 'kp') {
      return (document as CommercialProposal).client[field] || '';
    }
    return (document as Invoice).buyer[field] || '';
  };

  const updateClientField = (field: 'name' | 'bin' | 'address' | 'phone' | 'contactPerson', value: string) => {
    if (documentType === 'kp') {
      onUpdate({
        ...document,
        client: { ...(document as CommercialProposal).client, [field]: value }
      } as CommercialProposal);
    } else {
      onUpdate({
        ...document,
        buyer: { ...(document as Invoice).buyer, [field]: value }
      } as Invoice);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Реквизиты клиента</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div>
          <Label className="text-xs">Название компании / ФИО</Label>
          <Input
            value={getClientValue('name')}
            onChange={(e) => updateClientField('name', e.target.value)}
            placeholder='ТОО "Название" / ИП Фамилия И.О.'
            className="h-8 text-sm"
          />
        </div>
        <div>
          <Label className="text-xs">БИН / ИИН</Label>
          <Input
            value={getClientValue('bin')}
            onChange={(e) => updateClientField('bin', e.target.value)}
            placeholder="123456789012"
            className="h-8 text-sm"
          />
        </div>
        <div>
          <Label className="text-xs">Адрес</Label>
          <Input
            value={getClientValue('address')}
            onChange={(e) => updateClientField('address', e.target.value)}
            placeholder="г. Алматы, ул. Примера, 123"
            className="h-8 text-sm"
          />
        </div>
        <div>
          <Label className="text-xs">Телефон</Label>
          <Input
            value={getClientValue('phone')}
            onChange={(e) => updateClientField('phone', e.target.value)}
            placeholder="+7 7XX XXX XXXX"
            className="h-8 text-sm"
          />
        </div>
        <div>
          <Label className="text-xs">Контактное лицо</Label>
          <Input
            value={getClientValue('contactPerson')}
            onChange={(e) => updateClientField('contactPerson', e.target.value)}
            placeholder="Фамилия Имя"
            className="h-8 text-sm"
          />
        </div>
      </CardContent>
    </Card>
  );
};
