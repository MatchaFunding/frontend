////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Tipos para FiltersIdea
export type OrderOption = 'none' | 'idea-asc' | 'idea-desc' | 'campo-asc' | 'campo-desc' | 'fecha-desc' | 'fecha-asc';
export type CardsPerPageOption = 8 | 10 | 15 | 25 | 40 | 999;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Estado de los filtros aplicados para ideas
export interface FiltersIdeaValues {
  campo: string;
  publico: string;
  orderBy: OrderOption;
  searchIdea: string;
  searchCampo: string;
  fechaMin: string;
  fechaMax: string;
}

// Describe qué datos y funciones externas necesita el componente
export interface FiltersIdeaProps {
  filters: FiltersIdeaValues;
  onApplyFilters: (filters: FiltersIdeaValues) => void;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
  fechaMin: '',
  fechaMax: ''
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Funciones de ordenamiento para ideas

// Interfaz para representar una idea (ajusta según tu estructura de datos)
export interface IdeaItem {
  id: number;
  field: string;        // Campo de la idea
  problem: string;      // Problema/título de la idea
  audience: string;     // Público objetivo
  uniqueness: string;   // Innovación/unicidad
  createdAt: string;    // Fecha de creación
}

// Función principal de ordenamiento
export function sortIdeas(ideas: IdeaItem[], orderBy: OrderOption): IdeaItem[] {
  const sortedIdeas = [...ideas];
  
  switch (orderBy) {
    case 'idea-asc':
      return sortedIdeas.sort((a, b) => a.problem.localeCompare(b.problem));
    
    case 'idea-desc':
      return sortedIdeas.sort((a, b) => b.problem.localeCompare(a.problem));
    
    case 'campo-asc':
      return sortedIdeas.sort((a, b) => a.field.localeCompare(b.field));
    
    case 'campo-desc':
      return sortedIdeas.sort((a, b) => b.field.localeCompare(a.field));
    
    case 'fecha-desc':
      return sortedIdeas.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    case 'fecha-asc':
      return sortedIdeas.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    
    case 'none':
    default:
      return sortedIdeas;
  }
}

// Función para filtrar ideas por campo
export function filterIdeasByField(ideas: IdeaItem[], field: string): IdeaItem[] {
  if (!field || field === '') {
    return ideas;
  }
  return ideas.filter(idea => idea.field === field);
}

// Función para filtrar ideas por público objetivo
export function filterIdeasByAudience(ideas: IdeaItem[], audience: string): IdeaItem[] {
  if (!audience || audience === '') {
    return ideas;
  }
  return ideas.filter(idea => idea.audience === audience);
}

// Función para filtrar ideas por texto en idea/problema
export function filterIdeasByIdeaText(ideas: IdeaItem[], searchText: string): IdeaItem[] {
  if (!searchText || searchText.trim() === '') {
    return ideas;
  }
  const searchLower = searchText.toLowerCase().trim();
  return ideas.filter(idea => 
    idea.problem?.toLowerCase().includes(searchLower)
  );
}

// Función para filtrar ideas por texto en campo
export function filterIdeasByCampoText(ideas: IdeaItem[], searchText: string): IdeaItem[] {
  if (!searchText || searchText.trim() === '') {
    return ideas;
  }
  const searchLower = searchText.toLowerCase().trim();
  return ideas.filter(idea => 
    idea.field?.toLowerCase().includes(searchLower)
  );
}

// Función para filtrar ideas por rango de fechas
export function filterIdeasByDateRange(ideas: IdeaItem[], fechaMin: string, fechaMax: string): IdeaItem[] {
  if (!fechaMin && !fechaMax) {
    return ideas;
  }
  
  return ideas.filter(idea => {
    if (!idea.createdAt) return false;
    
    const ideaDate = new Date(idea.createdAt);
    const minDate = fechaMin ? new Date(fechaMin) : null;
    const maxDate = fechaMax ? new Date(fechaMax) : null;
    
    if (minDate && ideaDate < minDate) return false;
    if (maxDate && ideaDate > maxDate) return false;
    
    return true;
  });
}

// Función combinada para aplicar todos los filtros y ordenamiento
export function applyFiltersAndSorting(
  ideas: IdeaItem[], 
  filters: FiltersIdeaValues
): IdeaItem[] {
  let filteredIdeas = [...ideas];
  
  // Aplicar filtro por campo
  filteredIdeas = filterIdeasByField(filteredIdeas, filters.campo);
  
  // Aplicar filtro por público objetivo
  filteredIdeas = filterIdeasByAudience(filteredIdeas, filters.publico);
  
  // Aplicar filtro por texto en idea/problema
  filteredIdeas = filterIdeasByIdeaText(filteredIdeas, filters.searchIdea);
  
  // Aplicar filtro por texto en campo
  filteredIdeas = filterIdeasByCampoText(filteredIdeas, filters.searchCampo);
  
  // Aplicar filtro por rango de fechas
  filteredIdeas = filterIdeasByDateRange(filteredIdeas, filters.fechaMin, filters.fechaMax);
  
  // Aplicar ordenamiento
  filteredIdeas = sortIdeas(filteredIdeas, filters.orderBy);
  
  return filteredIdeas;
}
