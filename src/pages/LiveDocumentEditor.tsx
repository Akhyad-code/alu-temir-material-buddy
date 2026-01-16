import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import html2canvas from 'html2canvas';
import { 
  FileText,
  Receipt,
  Printer,
  ArrowLeft,
  Download,
  Image,
  Save,
} from 'lucide-react';
import { 
  CommercialProposal, 
  Invoice, 
  DocumentItem,
  DEFAULT_COMPANY_INFO,
} from '@/types/documents';
import { CommercialProposalPreview } from '@/components/documents/CommercialProposalPreview';
import { InvoicePreview } from '@/components/documents/InvoicePreview';
import { DEFAULT_DIMENSIONS } from '@/components/documents/ProfileDiagrams';
import { CalculatorPanel } from '@/components/documents/CalculatorPanel';
import { DocumentItemsTable } from '@/components/documents/DocumentItemsTable';
import { ClientInfoPanel } from '@/components/documents/ClientInfoPanel';
import { DiagramSettingsPanel } from '@/components/documents/DiagramSettingsPanel';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { toast } from 'sonner';

type DocumentType = CommercialProposal | Invoice;

const createNewKP = (): CommercialProposal => ({
  id: Date.now(),
  type: 'kp',
  number: '1',
  date: new Date().toLocaleDateString('ru-RU'),
  city: 'г. Алматы',
  client: { name: '', bin: '', address: '', phone: '', contactPerson: '' },
  items: [],
  notes: '',
  showDiagram: true,
  diagramDimensions: { ...DEFAULT_DIMENSIONS },
});

const createNewInvoice = (): Invoice => ({
  id: Date.now(),
  type: 'invoice',
  number: '1',
  date: new Date().toLocaleDateString('ru-RU'),
  supplier: { ...DEFAULT_COMPANY_INFO },
  buyer: { name: '', bin: '', address: '', phone: '', contactPerson: '' },
  items: [],
  includeVAT: true,
  vatRate: 12,
});

export const LiveDocumentEditor: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [documents, setDocuments] = useLocalStorage<DocumentType[]>('alu-temir-documents', []);
  const previewRef = useRef<HTMLDivElement>(null);
  
  // Get params from URL
  const editId = searchParams.get('edit');
  const typeParam = searchParams.get('type');
  
  // Document state
  const [documentType, setDocumentType] = useState<'kp' | 'invoice'>('kp');
  const [currentDocument, setCurrentDocument] = useState<DocumentType>(createNewKP());
  const [isEditing, setIsEditing] = useState(false);
  
  // Load document if editing
  useEffect(() => {
    if (editId) {
      const docToEdit = documents.find(doc => doc.id === parseInt(editId));
      if (docToEdit) {
        setCurrentDocument(docToEdit);
        setDocumentType(docToEdit.type);
        setIsEditing(true);
      }
    } else if (typeParam === 'invoice') {
      setDocumentType('invoice');
      setCurrentDocument(createNewInvoice());
    } else {
      setDocumentType('kp');
      setCurrentDocument(createNewKP());
    }
  }, [editId, typeParam, documents]);
  
  // Switch document type
  const handleDocumentTypeChange = (type: 'kp' | 'invoice') => {
    if (isEditing) {
      toast.error('Нельзя сменить тип при редактировании');
      return;
    }
    setDocumentType(type);
    setCurrentDocument(type === 'kp' ? createNewKP() : createNewInvoice());
  };
  
  // Add item to document
  const handleAddItem = (newItem: DocumentItem) => {
    setCurrentDocument(prev => ({
      ...prev,
      items: [...prev.items, newItem],
    }));
  };
  
  // Update item
  const handleUpdateItem = (id: number, updates: Partial<DocumentItem>) => {
    setCurrentDocument(prev => ({
      ...prev,
      items: prev.items.map(item => 
        item.id === id ? { ...item, ...updates } : item
      ),
    }));
  };
  
  // Delete item
  const handleDeleteItem = (id: number) => {
    setCurrentDocument(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id),
    }));
  };
  
  // Save document
  const saveDocument = () => {
    if (isEditing) {
      // Update existing document
      setDocuments(documents.map(doc => 
        doc.id === currentDocument.id ? currentDocument : doc
      ));
      toast.success('Документ обновлён');
    } else {
      // Create new document
      const newDoc = { ...currentDocument, id: Date.now() };
      setDocuments([newDoc, ...documents]);
      setCurrentDocument(newDoc);
      setIsEditing(true);
      toast.success('Документ сохранён');
    }
  };
  
  // Print
  const handlePrint = () => {
    window.print();
  };
  
  // Download as JPEG
  const downloadAsJpeg = async () => {
    const element = previewRef.current;
    if (!element) return;
    
    try {
      toast.loading('Создание изображения...');
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
      });
      
      const link = document.createElement('a');
      const docName = documentType === 'kp' 
        ? `КП_${currentDocument.number}_${currentDocument.date.replace(/\./g, '-')}`
        : `Счет_${currentDocument.number}_${currentDocument.date.replace(/\./g, '-')}`;
      link.download = `${docName}.jpg`;
      link.href = canvas.toDataURL('image/jpeg', 0.95);
      link.click();
      
      toast.dismiss();
      toast.success('Изображение сохранено');
    } catch (error) {
      toast.dismiss();
      toast.error('Ошибка при создании изображения');
    }
  };
  
  // Download as PDF (via print)
  const downloadAsPdf = () => {
    toast.info('Для сохранения в PDF выберите "Сохранить как PDF" в диалоге печати');
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
              disabled={isEditing}
            >
              <FileText className="h-4 w-4 mr-1" />
              КП
            </Button>
            <Button
              variant={documentType === 'invoice' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleDocumentTypeChange('invoice')}
              disabled={isEditing}
            >
              <Receipt className="h-4 w-4 mr-1" />
              Счёт
            </Button>
          </div>
          
          {isEditing && (
            <span className="text-sm text-muted-foreground border-l pl-4">
              Редактирование: {documentType === 'kp' ? 'КП' : 'Счёт'} № {currentDocument.number}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={saveDocument}>
            <Save className="h-4 w-4 mr-2" />
            {isEditing ? 'Обновить' : 'Сохранить'}
          </Button>
          
          {/* Download dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Скачать
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-popover">
              <DropdownMenuItem onClick={downloadAsPdf}>
                <FileText className="h-4 w-4 mr-2" />
                Скачать PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={downloadAsJpeg}>
                <Image className="h-4 w-4 mr-2" />
                Скачать JPEG
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
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
            {/* Calculator */}
            <CalculatorPanel onAddItem={handleAddItem} />
            
            {/* Items List */}
            <DocumentItemsTable 
              items={currentDocument.items}
              total={total}
              onDeleteItem={handleDeleteItem}
              onUpdateItem={handleUpdateItem}
            />
            
            {/* Profile Diagram Settings (only for KP) */}
            {documentType === 'kp' && (
              <DiagramSettingsPanel
                document={currentDocument as CommercialProposal}
                onUpdate={(doc) => setCurrentDocument(doc)}
              />
            )}
            
            {/* Client Info */}
            <ClientInfoPanel
              documentType={documentType}
              document={currentDocument}
              onUpdate={setCurrentDocument}
            />
          </div>
        </div>

        {/* Right Panel - Live Preview */}
        <div className="flex-1 bg-muted/30 overflow-auto p-6 print:p-0 print:bg-white">
          <div ref={previewRef} className="print:shadow-none">
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