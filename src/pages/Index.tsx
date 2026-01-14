import React, { useEffect, useState, useCallback } from 'react';
import { Routes, Route, useNavigate, useParams } from 'react-router-dom';
import { Header } from '@/components/Header';
import { GlobalSearch } from '@/components/GlobalSearch';
import { ProjectsPage } from '@/pages/ProjectsPage';
import { TemplatesPage } from '@/pages/TemplatesPage';
import { ProjectDetailPage } from '@/pages/ProjectDetailPage';
import { CalculatorPage } from '@/pages/CalculatorPage';
import { DocumentsPage } from '@/pages/DocumentsPage';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Project, Template, Material } from '@/types';

const ProjectDetailWrapper: React.FC<{
  projects: Project[];
  templates: Template[];
  onUpdateProject: (project: Project) => void;
  onSaveTemplate: (name: string, category: string, materials: Material[]) => void;
}> = ({ projects, templates, onUpdateProject, onSaveTemplate }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const project = projects.find((p) => p.id === Number(id));

  if (!project) {
    navigate('/');
    return null;
  }

  return (
    <ProjectDetailPage
      project={project}
      templates={templates}
      onUpdateProject={onUpdateProject}
      onSaveTemplate={onSaveTemplate}
    />
  );
};

const Index: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useLocalStorage<Project[]>('alu-temir-projects', []);
  const [templates, setTemplates] = useLocalStorage<Template[]>('alu-temir-templates', []);
  const [showGlobalSearch, setShowGlobalSearch] = useState(false);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+K - Global search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowGlobalSearch(true);
      }

      // Ctrl+N - New project
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        createProject();
      }

      // Escape - Close search
      if (e.key === 'Escape' && showGlobalSearch) {
        setShowGlobalSearch(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showGlobalSearch]);

  const createProject = () => {
    const newProject: Project = {
      id: Date.now(),
      name: 'Новый объект',
      location: '',
      date: new Date().toLocaleDateString('ru-RU'),
      materials: [],
      notes: '',
      files: [],
    };
    setProjects([newProject, ...projects]);
    navigate(`/project/${newProject.id}`);
  };

  const deleteProject = (id: number) => {
    setProjects(projects.filter((p) => p.id !== id));
  };

  const updateProject = (updatedProject: Project) => {
    setProjects(projects.map((p) => (p.id === updatedProject.id ? updatedProject : p)));
  };

  const saveTemplate = (name: string, category: string, materials: Material[]) => {
    const newTemplate: Template = {
      id: Date.now(),
      name,
      category,
      materials: materials.map((m) => ({ ...m, quantity: '' })),
    };
    setTemplates([newTemplate, ...templates]);
  };

  const deleteTemplate = (id: number) => {
    setTemplates(templates.filter((t) => t.id !== id));
  };

  const addMaterialToProject = (projectId: number, material: Material) => {
    setProjects(projects.map((p) => 
      p.id === projectId 
        ? { ...p, materials: [...p.materials, material] }
        : p
    ));
  };

  const handleSearchNavigate = useCallback((path: string) => {
    navigate(path);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header onOpenSearch={() => setShowGlobalSearch(true)} />
      
      {/* Global Search Modal */}
      <GlobalSearch
        isOpen={showGlobalSearch}
        onClose={() => setShowGlobalSearch(false)}
        onNavigate={handleSearchNavigate}
        projects={projects.map((p) => ({ id: p.id, name: p.name, location: p.location }))}
        templates={templates.map((t) => ({ id: t.id, name: t.name, category: t.category }))}
      />

      <main className="flex-1">
        <Routes>
          <Route
            path="/"
            element={
              <ProjectsPage
                projects={projects}
                onDeleteProject={deleteProject}
                onCreateProject={createProject}
              />
            }
          />
          <Route
            path="/calculator"
            element={
              <CalculatorPage
                projects={projects}
                onAddMaterialToProject={addMaterialToProject}
              />
            }
          />
          <Route
            path="/templates"
            element={
              <TemplatesPage templates={templates} onDeleteTemplate={deleteTemplate} />
            }
          />
          <Route path="/documents" element={<DocumentsPage />} />
          <Route
            path="/project/:id"
            element={
              <ProjectDetailWrapper
                projects={projects}
                templates={templates}
                onUpdateProject={updateProject}
                onSaveTemplate={saveTemplate}
              />
            }
          />
        </Routes>
      </main>

      {/* Status Bar for Desktop */}
      <footer className="hidden lg:flex items-center justify-between px-4 py-2 bg-card border-t border-border text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          <span>ALU-TEMIR Калькулятор материалов v1.0</span>
          <span className="text-border">|</span>
          <span>Проектов: {projects.length}</span>
          <span className="text-border">|</span>
          <span>Шаблонов: {templates.length}</span>
        </div>
        <div className="flex items-center gap-4">
          <span>Данные сохраняются локально</span>
        </div>
      </footer>
    </div>
  );
};

export default Index;
