import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CommercialProposal, 
  Invoice, 
  DEFAULT_COMPANY_INFO,
  formatCurrency 
} from '@/types/documents';
import { Project } from '@/types';
import { DocumentEditor } from '@/components/documents/DocumentEditor';
import { CommercialProposalPreview } from '@/components/documents/CommercialProposalPreview';
import { InvoicePreview } from '@/components/documents/InvoicePreview';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  FileText, 
  Receipt, 
  Plus, 
  Printer, 
  Download,
  Eye,
  Edit,
  Trash2,
  Copy
} from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

type DocumentType = CommercialProposal | Invoice;

const createNewKP = (): CommercialProposal => ({
  id: Date.now(),
  type: 'kp',
  number: '1',
  date: new Date().toLocaleDateString('ru-RU'),
  city: 'г. Алматы',
  client: {
    name: '',
    address: '',
  },
  items: [],
  notes: '',
});

const createNewInvoice = (): Invoice => ({
  id: Date.now(),
  type: 'invoice',
  number: '1',
  date: new Date().toLocaleDateString('ru-RU'),
  supplier: { ...DEFAULT_COMPANY_INFO },
  buyer: {
    name: '',
    address: '',
  },
  items: [],
  includeVAT: true,
  vatRate: 12,
});

export const DocumentsPage: React.FC = () => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useLocalStorage<DocumentType[]>('alu-temir-documents', []);
  const [projects] = useLocalStorage<Project[]>('alu-temir-projects', []);
  const [activeDocument, setActiveDocument] = useState<DocumentType | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<number | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const handleCreateDocument = (type: 'kp' | 'invoice') => {
    const newDoc = type === 'kp' ? createNewKP() : createNewInvoice();
    setDocuments([newDoc, ...documents]);
    setActiveDocument(newDoc);
    setShowEditor(true);
  };

  const handleUpdateDocument = (updatedDoc: DocumentType) => {
    setActiveDocument(updatedDoc);
    setDocuments(documents.map(doc => 
      doc.id === updatedDoc.id ? updatedDoc : doc
    ));
  };

  const handleDeleteDocument = (id: number) => {
    setDocumentToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (documentToDelete) {
      setDocuments(documents.filter(doc => doc.id !== documentToDelete));
      if (activeDocument?.id === documentToDelete) {
        setActiveDocument(null);
        setShowEditor(false);
      }
    }
    setDeleteDialogOpen(false);
    setDocumentToDelete(null);
  };

  const handleDuplicateDocument = (doc: DocumentType) => {
    const newDoc = {
      ...doc,
      id: Date.now(),
      number: String(parseInt(doc.number) + 1 || 1),
    };
    setDocuments([newDoc, ...documents]);
  };

  const handlePrint = () => {
    window.print();
  };

  const kpDocuments = documents.filter(doc => doc.type === 'kp') as CommercialProposal[];
  const invoiceDocuments = documents.filter(doc => doc.type === 'invoice') as Invoice[];

  if (showEditor && activeDocument) {
    return (
      <div className="h-screen flex flex-col bg-background">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-card no-print">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => {
                setShowEditor(false);
                setActiveDocument(null);
              }}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Назад
            </Button>
            <span className="text-sm text-muted-foreground">
              {activeDocument.type === 'kp' ? 'Коммерческое предложение' : 'Счет на оплату'} 
              {' '}№ {activeDocument.number}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              Печать
            </Button>
          </div>
        </div>

        {/* Editor & Preview Split View */}
        <div className="flex-1 flex overflow-hidden">
          {/* Editor Panel */}
          <div className="w-[400px] border-r border-border bg-card overflow-hidden no-print">
            <DocumentEditor 
              document={activeDocument} 
              onUpdate={handleUpdateDocument}
              projects={projects}
            />
          </div>

          {/* Preview Panel */}
          <div className="flex-1 bg-muted/30 overflow-auto p-8 print:p-0 print:bg-white">
            <div ref={previewRef} className="print:shadow-none">
              {activeDocument.type === 'kp' ? (
                <CommercialProposalPreview document={activeDocument as CommercialProposal} />
              ) : (
                <InvoicePreview document={activeDocument as Invoice} />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Документы</h1>
            <p className="text-sm text-muted-foreground">
              Коммерческие предложения и счета на оплату
            </p>
          </div>
        </div>
      </div>

      {/* Create New Document Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Card 
          className="cursor-pointer hover:border-primary transition-colors"
          onClick={() => handleCreateDocument('kp')}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent/10">
                <FileText className="h-6 w-6 text-accent" />
              </div>
              <div>
                <CardTitle className="text-lg">Коммерческое предложение</CardTitle>
                <CardDescription>Создать новое КП для клиента</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Создать КП
            </Button>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:border-primary transition-colors"
          onClick={() => handleCreateDocument('invoice')}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Receipt className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Счет на оплату</CardTitle>
                <CardDescription>Создать новый счет для оплаты</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Создать счет
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Documents List */}
      <Tabs defaultValue="kp" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="kp" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            КП ({kpDocuments.length})
          </TabsTrigger>
          <TabsTrigger value="invoices" className="flex items-center gap-2">
            <Receipt className="h-4 w-4" />
            Счета ({invoiceDocuments.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="kp">
          {kpDocuments.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Нет коммерческих предложений</p>
                <Button 
                  className="mt-4" 
                  onClick={() => handleCreateDocument('kp')}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Создать первое КП
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {kpDocuments.map((doc) => (
                <Card key={doc.id} className="hover:bg-muted/30 transition-colors">
                  <CardContent className="flex items-center justify-between py-4">
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-accent/10">
                        <FileText className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <p className="font-medium">КП № {doc.number}</p>
                        <p className="text-sm text-muted-foreground">
                          {doc.date} • {doc.client.name || 'Клиент не указан'} • {doc.items.length} позиций
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium">
                        {formatCurrency(doc.items.reduce((sum, item) => sum + item.total, 0))} ₸
                      </span>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setActiveDocument(doc);
                            setShowEditor(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDuplicateDocument(doc)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDeleteDocument(doc.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="invoices">
          {invoiceDocuments.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Receipt className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Нет счетов на оплату</p>
                <Button 
                  className="mt-4" 
                  variant="outline"
                  onClick={() => handleCreateDocument('invoice')}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Создать первый счет
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {invoiceDocuments.map((doc) => (
                <Card key={doc.id} className="hover:bg-muted/30 transition-colors">
                  <CardContent className="flex items-center justify-between py-4">
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Receipt className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Счет № {doc.number}</p>
                        <p className="text-sm text-muted-foreground">
                          {doc.date} • {doc.buyer.name || 'Покупатель не указан'} • {doc.items.length} позиций
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium">
                        {formatCurrency(doc.items.reduce((sum, item) => sum + item.total, 0))} ₸
                      </span>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setActiveDocument(doc);
                            setShowEditor(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDuplicateDocument(doc)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDeleteDocument(doc.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить документ?</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие нельзя отменить. Документ будет удален навсегда.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
