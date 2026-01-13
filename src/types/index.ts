export interface Material {
  id: number;
  name: string;
  unit: string;
  quantity: string;
  category: string;
  notes: string;
}

export interface ProjectFile {
  id: number;
  name: string;
  type: string;
  size: number;
  data: string;
  uploadDate: string;
}

export interface Project {
  id: number;
  name: string;
  location: string;
  date: string;
  materials: Material[];
  notes: string;
  files: ProjectFile[];
}

export interface Template {
  id: number;
  name: string;
  category: string;
  materials: Material[];
}

export const UNITS = [
  { value: 'м.п.', label: 'м.п. (метры погонные)' },
  { value: 'шт', label: 'шт (штуки)' },
  { value: 'м²', label: 'м² (квадратные метры)' },
  { value: 'кг', label: 'кг (килограммы)' },
  { value: 'л', label: 'л (литры)' },
  { value: 'упак', label: 'упак (упаковки)' },
];

export const MATERIAL_CATEGORIES = [
  'Реечные потолки',
  'Крепеж',
  'Комплектующие',
  'Фасады',
  'Другое',
];

export const TEMPLATE_CATEGORIES = [
  'Потолки',
  'Фасады',
  'Комплексные',
  'Другое',
];
