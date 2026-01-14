import React, { useState } from 'react';
import { Project, Material } from '@/types';
import { DocumentItem } from '@/types/documents';
import { Button } from '@/components/ui/button';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FolderOpen, Import, Search, Package } from 'lucide-react';

interface ImportFromProjectProps {
  projects: Project[];
  onImport: (items: DocumentItem[]) => void;
}

export const ImportFromProject: React.FC<ImportFromProjectProps> = ({
  projects,
  onImport,
}) => {
  const [open, setOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedMaterials, setSelectedMaterials] = useState<Set<number>>(new Set());
  const [prices, setPrices] = useState<Record<number, number>>({});
  const [searchQuery, setSearchQuery] = useState('');

  const handleProjectSelect = (project: Project) => {
    setSelectedProject(project);
    setSelectedMaterials(new Set());
    // Initialize prices from material names if they contain price hints
    const initialPrices: Record<number, number> = {};
    project.materials.forEach((m) => {
      initialPrices[m.id] = 0;
    });
    setPrices(initialPrices);
  };

  const handleMaterialToggle = (materialId: number) => {
    const newSelected = new Set(selectedMaterials);
    if (newSelected.has(materialId)) {
      newSelected.delete(materialId);
    } else {
      newSelected.add(materialId);
    }
    setSelectedMaterials(newSelected);
  };

  const handleSelectAll = () => {
    if (!selectedProject) return;
    if (selectedMaterials.size === selectedProject.materials.length) {
      setSelectedMaterials(new Set());
    } else {
      setSelectedMaterials(new Set(selectedProject.materials.map((m) => m.id)));
    }
  };

  const handlePriceChange = (materialId: number, price: number) => {
    setPrices({ ...prices, [materialId]: price });
  };

  const handleImport = () => {
    if (!selectedProject) return;

    const items: DocumentItem[] = selectedProject.materials
      .filter((m) => selectedMaterials.has(m.id))
      .map((material) => {
        const qty = parseFloat(material.quantity) || 1;
        const price = prices[material.id] || 0;
        return {
          id: Date.now() + material.id,
          name: material.name,
          size: '',
          unit: material.unit,
          price: price,
          quantity: qty,
          total: qty * price,
        };
      });

    onImport(items);
    setOpen(false);
    setSelectedProject(null);
    setSelectedMaterials(new Set());
    setPrices({});
  };

  const filteredProjects = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Import className="h-4 w-4" />
          Из проекта
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Импорт материалов из проекта</DialogTitle>
          <DialogDescription>
            Выберите проект и материалы для добавления в документ
          </DialogDescription>
        </DialogHeader>

        {!selectedProject ? (
          <div className="flex-1 flex flex-col">
            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Поиск проекта..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Projects List */}
            <ScrollArea className="flex-1 max-h-[400px]">
              {filteredProjects.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FolderOpen className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Проекты не найдены</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredProjects.map((project) => (
                    <button
                      key={project.id}
                      className="w-full text-left p-3 rounded-lg border border-border hover:border-primary hover:bg-muted/50 transition-colors"
                      onClick={() => handleProjectSelect(project)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <FolderOpen className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{project.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {project.location || 'Без адреса'} • {project.materials.length} материалов
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        ) : (
          <div className="flex-1 flex flex-col">
            {/* Back button */}
            <Button
              variant="ghost"
              size="sm"
              className="self-start mb-2"
              onClick={() => setSelectedProject(null)}
            >
              ← Назад к списку
            </Button>

            {/* Project info */}
            <div className="p-3 bg-muted/50 rounded-lg mb-4">
              <p className="font-medium">{selectedProject.name}</p>
              <p className="text-sm text-muted-foreground">{selectedProject.location}</p>
            </div>

            {/* Select all */}
            <div className="flex items-center gap-2 mb-3">
              <Checkbox
                id="select-all"
                checked={selectedMaterials.size === selectedProject.materials.length}
                onCheckedChange={handleSelectAll}
              />
              <Label htmlFor="select-all" className="text-sm cursor-pointer">
                Выбрать все ({selectedProject.materials.length})
              </Label>
            </div>

            {/* Materials list */}
            <ScrollArea className="flex-1 max-h-[300px]">
              {selectedProject.materials.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>В проекте нет материалов</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {selectedProject.materials.map((material) => (
                    <div
                      key={material.id}
                      className={`p-3 rounded-lg border transition-colors ${
                        selectedMaterials.has(material.id)
                          ? 'border-primary bg-primary/5'
                          : 'border-border'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={selectedMaterials.has(material.id)}
                          onCheckedChange={() => handleMaterialToggle(material.id)}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">{material.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {material.quantity} {material.unit} • {material.category}
                          </p>
                        </div>
                        {selectedMaterials.has(material.id) && (
                          <div className="flex items-center gap-2">
                            <Label className="text-xs whitespace-nowrap">Цена:</Label>
                            <Input
                              type="number"
                              value={prices[material.id] || ''}
                              onChange={(e) =>
                                handlePriceChange(material.id, parseFloat(e.target.value) || 0)
                              }
                              className="h-8 w-24 text-sm"
                              placeholder="0"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>

            {/* Import button */}
            <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
              <Button variant="outline" onClick={() => setSelectedProject(null)}>
                Отмена
              </Button>
              <Button
                onClick={handleImport}
                disabled={selectedMaterials.size === 0}
              >
                <Import className="h-4 w-4 mr-2" />
                Импортировать ({selectedMaterials.size})
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
