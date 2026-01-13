import React from 'react';
import { Routes, Route, useNavigate, useParams } from 'react-router-dom';
import { Header } from '@/components/Header';
import { ProjectsPage } from '@/pages/ProjectsPage';
import { TemplatesPage } from '@/pages/TemplatesPage';
import { ProjectDetailPage } from '@/pages/ProjectDetailPage';
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

  return (
    <div className="min-h-screen">
      <Header />
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
          path="/templates"
          element={
            <TemplatesPage templates={templates} onDeleteTemplate={deleteTemplate} />
          }
        />
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
    </div>
  );
};

export default Index;
