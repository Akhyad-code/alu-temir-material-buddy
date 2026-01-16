import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CommercialProposal, 
  Invoice, 
  formatCurrency 
} from '@/types/documents';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  FileText, 
  Receipt, 
  Plus, 
  Edit,
  Trash2,
  Copy,
  Calculator
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

export const DocumentsPage: React.FC = () => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useLocalStorage<DocumentType[]>('alu-temir-documents', []);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<number | null>(null);

  const handleDeleteDocument = (id: number) => {
    setDocumentToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (documentToDelete) {
      setDocuments(documents.filter(doc => doc.id !== documentToDelete));
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

  const handleEditDocument = (doc: DocumentType) => {
    // Navigate to live editor with document ID
    navigate(`/documents/editor?edit=${doc.id}`);
  };

  const kpDocuments = documents.filter(doc => doc.type === 'kp') as CommercialProposal[];
  const invoiceDocuments = documents.filter(doc => doc.type === 'invoice') as Invoice[];

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

      {/* Live Editor Card */}
      <Card className="mb-6 border-primary/30 bg-gradient-to-r from-primary/5 to-accent/5">
        <CardContent className="flex items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-primary/10">
              <Calculator className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Live Редактор</h3>
              <p className="text-sm text-muted-foreground">
                Создание КП и счетов с калькулятором
              </p>
            </div>
          </div>
          <Button onClick={() => navigate('/documents/editor')} size="lg">
            <Plus className="h-4 w-4 mr-2" />
            Создать документ
          </Button>
        </CardContent>
      </Card>

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
                  onClick={() => navigate('/documents/editor?type=kp')}
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
                          onClick={() => handleEditDocument(doc)}
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
                  onClick={() => navigate('/documents/editor?type=invoice')}
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
                          onClick={() => handleEditDocument(doc)}
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