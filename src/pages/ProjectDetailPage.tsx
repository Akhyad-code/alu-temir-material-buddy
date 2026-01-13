import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Plus,
  Save,
  Printer,
  Paperclip,
  LayoutTemplate,
  Package,
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { MaterialForm } from '@/components/MaterialForm';
import { MaterialCard } from '@/components/MaterialCard';
import { TemplateForm } from '@/components/TemplateForm';
import { FileManager } from '@/components/FileManager';
import { SearchFilter } from '@/components/SearchFilter';
import { Project, Material, Template, ProjectFile, MATERIAL_CATEGORIES } from '@/types';

interface ProjectDetailPageProps {
  project: Project;
  templates: Template[];
  onUpdateProject: (project: Project) => void;
  onSaveTemplate: (name: string, category: string, materials: Material[]) => void;
}

export const ProjectDetailPage: React.FC<ProjectDetailPageProps> = ({
  project,
  templates,
  onUpdateProject,
  onSaveTemplate,
}) => {
  const navigate = useNavigate();
  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showFileModal, setShowFileModal] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const filteredMaterials = useMemo(() => {
    let result = project.materials;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter((material) => {
        if (material.name.toLowerCase().includes(query)) return true;
        if (material.notes.toLowerCase().includes(query)) return true;
        if (material.quantity.toLowerCase().includes(query)) return true;
        return false;
      });
    }

    // Filter by category
    if (categoryFilter) {
      result = result.filter((material) => material.category === categoryFilter);
    }

    return result;
  }, [project.materials, searchQuery, categoryFilter]);

  const categoryOptions = MATERIAL_CATEGORIES.map((cat) => ({
    value: cat,
    label: cat,
  }));

  const updateField = (field: keyof Project, value: string) => {
    onUpdateProject({ ...project, [field]: value });
  };

  const handleAddMaterial = (materialData: Omit<Material, 'id'>) => {
    const newMaterial: Material = {
      ...materialData,
      id: Date.now() + Math.random(),
    };
    onUpdateProject({
      ...project,
      materials: [...project.materials, newMaterial],
    });
    setShowMaterialModal(false);
  };

  const handleEditMaterial = (materialData: Omit<Material, 'id'>) => {
    if (!editingMaterial) return;
    const updatedMaterials = project.materials.map((m) =>
      m.id === editingMaterial.id ? { ...materialData, id: m.id } : m
    );
    onUpdateProject({ ...project, materials: updatedMaterials });
    setEditingMaterial(null);
    setShowMaterialModal(false);
  };

  const handleDeleteMaterial = (id: number) => {
    onUpdateProject({
      ...project,
      materials: project.materials.filter((m) => m.id !== id),
    });
  };

  const handleSaveTemplate = (name: string, category: string) => {
    if (project.materials.length === 0) {
      alert('Добавьте хотя бы один материал перед сохранением шаблона');
      return;
    }
    onSaveTemplate(name, category, project.materials);
    setShowTemplateModal(false);
    alert('Шаблон сохранен!');
  };

  const handleLoadTemplate = (template: Template) => {
    const materialsWithNewIds = template.materials.map((m) => ({
      ...m,
      id: Date.now() + Math.random(),
      quantity: '',
    }));
    onUpdateProject({
      ...project,
      materials: [...project.materials, ...materialsWithNewIds],
    });
  };

  const handleFilesAdd = (files: ProjectFile[]) => {
    onUpdateProject({
      ...project,
      files: [...project.files, ...files],
    });
  };

  const handleFileDelete = (id: number) => {
    onUpdateProject({
      ...project,
      files: project.files.filter((f) => f.id !== id),
    });
  };

  const handleExport = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${project.name}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; color: #1a1a1a; }
            h1 { font-size: 24px; margin-bottom: 8px; }
            .meta { color: #666; margin-bottom: 24px; }
            table { width: 100%; border-collapse: collapse; margin: 24px 0; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background: #f5f5f5; font-weight: 600; }
            .notes { margin-top: 24px; padding: 16px; background: #f9f9f9; border-radius: 8px; }
            .files { margin-top: 24px; }
            .file-item { padding: 8px 0; border-bottom: 1px solid #eee; }
          </style>
        </head>
        <body>
          <h1>${project.name}</h1>
          <div class="meta">
            ${project.location ? `<p>Адрес: ${project.location}</p>` : ''}
            <p>Дата: ${project.date}</p>
          </div>
          
          ${project.materials.length > 0 ? `
            <table>
              <thead>
                <tr>
                  <th>№</th>
                  <th>Наименование</th>
                  <th>Категория</th>
                  <th>Количество</th>
                  <th>Ед. изм.</th>
                  <th>Примечания</th>
                </tr>
              </thead>
              <tbody>
                ${project.materials.map((m, i) => `
                  <tr>
                    <td>${i + 1}</td>
                    <td>${m.name}</td>
                    <td>${m.category}</td>
                    <td>${m.quantity || '—'}</td>
                    <td>${m.unit}</td>
                    <td>${m.notes || '—'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          ` : '<p>Нет материалов</p>'}
          
          ${project.notes ? `
            <div class="notes">
              <strong>Примечания:</strong>
              <p>${project.notes}</p>
            </div>
          ` : ''}
          
          ${project.files.length > 0 ? `
            <div class="files">
              <strong>Прикрепленные файлы:</strong>
              ${project.files.map(f => `
                <div class="file-item">${f.name} (${(f.size / 1024).toFixed(1)} KB)</div>
              `).join('')}
            </div>
          ` : ''}
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate('/')}
          className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="flex-1">
          <input
            type="text"
            value={project.name}
            onChange={(e) => updateField('name', e.target.value)}
            className="text-2xl font-bold text-foreground bg-transparent border-none outline-none w-full focus:ring-2 focus:ring-ring rounded px-2 -ml-2"
            placeholder="Название объекта"
          />
        </div>
      </div>

      {/* Project Info */}
      <div className="bg-card rounded-xl p-6 shadow-card mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1.5">
              Адрес
            </label>
            <input
              type="text"
              value={project.location}
              onChange={(e) => updateField('location', e.target.value)}
              className="input-field"
              placeholder="Адрес объекта"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1.5">
              Дата
            </label>
            <input
              type="text"
              value={project.date}
              onChange={(e) => updateField('date', e.target.value)}
              className="input-field"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1.5">
            Примечания к объекту
          </label>
          <textarea
            value={project.notes}
            onChange={(e) => updateField('notes', e.target.value)}
            className="input-field resize-none"
            rows={3}
            placeholder="Дополнительная информация..."
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <button
          onClick={() => {
            setEditingMaterial(null);
            setShowMaterialModal(true);
          }}
          className="btn-icon px-4 py-2.5 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Plus size={18} />
          <span>Добавить позицию</span>
        </button>

        <button
          onClick={() => setShowTemplateModal(true)}
          className="btn-icon px-4 py-2.5 rounded-lg text-sm font-medium bg-accent/10 text-accent hover:bg-accent/20"
        >
          <Save size={18} />
          <span>Сохранить как шаблон</span>
        </button>

        <button
          onClick={() => setShowFileModal(true)}
          className="btn-icon px-4 py-2.5 rounded-lg text-sm font-medium bg-purple/10 text-purple hover:bg-purple/20"
        >
          <Paperclip size={18} />
          <span>Файлы ({project.files.length})</span>
        </button>

        <button
          onClick={handleExport}
          className="btn-icon px-4 py-2.5 rounded-lg text-sm font-medium bg-muted text-foreground hover:bg-muted/80"
        >
          <Printer size={18} />
          <span>Экспорт</span>
        </button>
      </div>

      {/* Templates Quick Load */}
      {templates.length > 0 && (
        <div className="mb-6">
          <p className="text-sm text-muted-foreground mb-2">Загрузить шаблон:</p>
          <div className="flex flex-wrap gap-2">
            {templates.map((t) => (
              <button
                key={t.id}
                onClick={() => handleLoadTemplate(t)}
                className="btn-icon px-3 py-1.5 rounded-lg text-sm bg-accent/10 text-accent hover:bg-accent/20"
              >
                <LayoutTemplate size={14} />
                <span>{t.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Materials Search & Filter */}
      {project.materials.length > 0 && (
        <SearchFilter
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filterValue={categoryFilter}
          onFilterChange={setCategoryFilter}
          filterOptions={categoryOptions}
          filterLabel="категории"
          searchPlaceholder="Поиск по материалам..."
        />
      )}

      {/* Materials List */}
      {project.materials.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center bg-card rounded-xl shadow-card">
          <div className="w-16 h-16 bg-muted rounded-xl flex items-center justify-center mb-4">
            <Package className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Нет материалов
          </h3>
          <p className="text-muted-foreground mb-4">
            Добавьте первую позицию или загрузите шаблон
          </p>
          <button
            onClick={() => {
              setEditingMaterial(null);
              setShowMaterialModal(true);
            }}
            className="btn-icon px-4 py-2.5 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus size={18} />
            <span>Добавить позицию</span>
          </button>
        </div>
      ) : filteredMaterials.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center bg-card rounded-xl shadow-card">
          <p className="text-muted-foreground">
            По запросу ничего не найдено
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setCategoryFilter('');
            }}
            className="mt-4 text-sm text-primary hover:underline"
          >
            Сбросить фильтры
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMaterials.map((material) => (
            <MaterialCard
              key={material.id}
              material={material}
              onEdit={() => {
                setEditingMaterial(material);
                setShowMaterialModal(true);
              }}
              onDelete={() => handleDeleteMaterial(material.id)}
            />
          ))}
        </div>
      )}

      {/* Material Modal */}
      <Modal
        isOpen={showMaterialModal}
        onClose={() => {
          setShowMaterialModal(false);
          setEditingMaterial(null);
        }}
        title={editingMaterial ? 'Редактировать позицию' : 'Добавить позицию'}
      >
        <MaterialForm
          material={editingMaterial}
          onSave={editingMaterial ? handleEditMaterial : handleAddMaterial}
          onCancel={() => {
            setShowMaterialModal(false);
            setEditingMaterial(null);
          }}
        />
      </Modal>

      {/* Template Modal */}
      <Modal
        isOpen={showTemplateModal}
        onClose={() => setShowTemplateModal(false)}
        title="Сохранить как шаблон"
      >
        <TemplateForm
          onSave={handleSaveTemplate}
          onCancel={() => setShowTemplateModal(false)}
        />
      </Modal>

      {/* File Modal */}
      <Modal
        isOpen={showFileModal}
        onClose={() => setShowFileModal(false)}
        title="Файлы проекта"
        size="xl"
      >
        <FileManager
          files={project.files}
          onFilesAdd={handleFilesAdd}
          onFileDelete={handleFileDelete}
        />
      </Modal>
    </div>
  );
};
