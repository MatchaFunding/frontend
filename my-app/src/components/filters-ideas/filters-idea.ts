import Idea from '../../models/Idea'

// Tipos para FiltersIdea
export type OrderOption = 'none' | 'idea-asc' | 'idea-desc' | 'campo-asc' | 'campo-desc' | 'fecha-desc' | 'fecha-asc';
export type CardsPerPageOption = 8 | 10 | 15 | 25 | 40 | 999;

// Estado de los filtros aplicados para ideas
export interface FiltersIdeaValues {
  campo: string;
  publico: string;
  orderBy: OrderOption;
  searchIdea: string;
  searchCampo: string;
  fecha: string;
}

// Describe qué datos y funciones externas necesita el componente
export interface FiltersIdeaProps {
  filters: FiltersIdeaValues;
  onApplyFilters: (filters: FiltersIdeaValues) => void;
}

// Datos estáticos para ideas

// Campos de ideas (puedes ajustar según tus necesidades)
export const camposIdea = [
  'Tecnología', 'Salud', 'Educación', 'Medio Ambiente',
  'Finanzas', 'Comercio', 'Industria', 'Servicios',
  'Agricultura', 'Turismo', 'Arte y Cultura', 'Deportes'
];

// Públicos objetivo
export const publicosObjetivo = [
  'Niños', 'Adolescentes', 'Adultos jóvenes', 'Adultos',
  'Adultos mayores', 'Familias', 'Empresas', 'Gobierno',
  'ONGs', 'Estudiantes', 'Profesionales', 'General'
];

export const orderOptions = [
  { value: 'none', label: 'Sin orden' },
  { value: 'idea-asc', label: 'Idea (A-Z)' },
  { value: 'idea-desc', label: 'Idea (Z-A)' },
  { value: 'campo-asc', label: 'Campo (A-Z)' },
  { value: 'campo-desc', label: 'Campo (Z-A)' },
  { value: 'fecha-desc', label: 'Fecha (más reciente)' },
  { value: 'fecha-asc', label: 'Fecha (más antigua)' }
];

export const showOptions = [ 
    { value: 8, label: '8' }, 
    { value: 15, label: '15' }, 
    { value: 25, label: '25' }, 
    { value: 40, label: '40' }, 
    { value: 999, label: 'Todas' }
];

// Detecta cuando el usuario hace clic fuera de ciertos elementos
export const handleClickOutside = (
  event: MouseEvent,
  refs: { [key: string]: React.RefObject<HTMLDivElement | null> },
  setters: { [key: string]: React.Dispatch<React.SetStateAction<boolean>> }
) => {
  Object.keys(refs).forEach(key => {
    if (refs[key].current && !refs[key].current!.contains(event.target as Node)) {
      setters[key](false);
    }
  });
};

// Ejecuta una acción cuando el usuario presiona la tecla Enter en un elemento interactivo
export const handleKeyDown = (
  e: React.KeyboardEvent,
  callback: () => void,
  disabled: boolean = false
) => {
  if (e.key === 'Enter' && !disabled) {
    callback();
  }
};

// Valores iniciales para los filtros
export const initialFiltersIdea: FiltersIdeaValues = {
  campo: '',
  publico: '',
  orderBy: 'none',
  searchIdea: '',
  searchCampo: '',
  fecha: ''
};

// Funciones de ordenamiento para ideas

// Interfaz para representar una idea (ajusta según tu estructura de datos)
/*
export interface Idea {
  ID: number;
  Usuario: number;
  Campo: string;
  Problema: string;
  Publico: string;
  Innovacion: string;
  FechaDeCreacion: string | null;
  Propuesta: string | null;
}
*/

// Función principal de ordenamiento
export function sortIdeas(ideas: Idea[], orderBy: OrderOption): Idea[] {
  const sortedIdeas = [...ideas];
  switch (orderBy) {
    case 'idea-asc':
      return sortedIdeas.sort((a, b) => a.Problema.localeCompare(b.Problema));
    case 'idea-desc':
      return sortedIdeas.sort((a, b) => b.Problema.localeCompare(a.Problema));
    case 'campo-asc':
      return sortedIdeas.sort((a, b) => a.Campo.localeCompare(b.Campo));
    case 'campo-desc':
      return sortedIdeas.sort((a, b) => b.Campo.localeCompare(a.Campo));
    case 'none':
    default:
      return sortedIdeas;
  }
}

// Función para filtrar ideas por campo
export function filterIdeasByCampo(ideas: Idea[], Campo: string): Idea[] {
  if (!Campo || Campo === '') {
    return ideas;
  }
  return ideas.filter(idea => idea.Campo === Campo);
}

// Función para filtrar ideas por público objetivo
export function filterIdeasByAudience(ideas: Idea[], Publico: string): Idea[] {
  if (!Publico || Publico === '') {
    return ideas;
  }
  return ideas.filter(idea => idea.Publico === Publico);
}

// Función para filtrar ideas por texto en idea/problema
export function filterIdeasByIdeaText(ideas: Idea[], searchText: string): Idea[] {
  if (!searchText || searchText.trim() === '') {
    return ideas;
  }
  const searchLower = searchText.toLowerCase().trim();
  return ideas.filter(idea => 
    idea.Problema?.toLowerCase().includes(searchLower)
  );
}

// Función para filtrar ideas por texto en campo
export function filterIdeasByCampoText(ideas: Idea[], searchText: string): Idea[] {
  if (!searchText || searchText.trim() === '') {
    return ideas;
  }
  const searchLower = searchText.toLowerCase().trim();
  return ideas.filter(idea => 
    idea.Campo?.toLowerCase().includes(searchLower)
  );
}

// Función combinada para aplicar todos los filtros y ordenamiento
export function applyFiltersAndSorting(ideas: Idea[], filters: FiltersIdeaValues): Idea[] {
  let filteredIdeas = [...ideas];
  filteredIdeas = filterIdeasByCampo(filteredIdeas, filters.campo);
  filteredIdeas = filterIdeasByAudience(filteredIdeas, filters.publico);
  filteredIdeas = filterIdeasByIdeaText(filteredIdeas, filters.searchIdea);
  filteredIdeas = filterIdeasByCampoText(filteredIdeas, filters.searchCampo);
  filteredIdeas = sortIdeas(filteredIdeas, filters.orderBy);
  return filteredIdeas;
}
