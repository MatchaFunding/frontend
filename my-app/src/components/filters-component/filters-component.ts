////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Tipos para FiltersComponent
export type OrderOption = 'none' | 'title-asc' | 'amount-desc' | 'amount-asc';
export type CardsPerPageOption = 8 | 10 | 15 | 25 | 40 | 999;
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Estado de los filtros aplicados
export interface FiltersValues {
  region: string;
  amountMin: string;
  amountMax: string;
  currency: string;
  benefitType: string;
  status: string;
}
// Describe qué datos y funciones externas necesita el componente
export interface FiltersComponentProps {
  order: OrderOption;
  setOrder: (order: OrderOption) => void;
  cardsPerPage: CardsPerPageOption;
  setCardsPerPage: (cardsPerPage: CardsPerPageOption) => void;
  filters: FiltersValues;
  onApplyFilters: (filters: FiltersValues) => void;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Datos estáticos basados en el modelo Django
export const regionesChile = 
['Arica y Parinacota', 'Tarapacá', 'Antofagasta', 'Atacama', 
'Coquimbo', 'Valparaíso', 'Santiago', 'O\'Higgins', 
'Maule', 'Ñuble', 'Biobío', 'La Araucanía', 
'Los Ríos', 'Los Lagos', 'Aysén', 'Magallanes', 'Nacional'];

// Mapeo de nombres de regiones del frontend a códigos del backend
export const regionMapping: Record<string, string> = {
  'Arica y Parinacota': 'AP',
  'Tarapacá': 'TA',
  'Antofagasta': 'AN',
  'Atacama': 'AT',
  'Coquimbo': 'CO',
  'Valparaíso': 'VA',
  'Santiago': 'RM',
  'O\'Higgins': 'LI',
  'Maule': 'ML',
  'Ñuble': 'NB',
  'Biobío': 'BI',
  'La Araucanía': 'AR',
  'Los Ríos': 'LR',
  'Los Lagos': 'LL',
  'Aysén': 'AI',
  'Magallanes': 'MA',
  'Nacional': 'NA'
};

export const monedas = ['CLP', 'EUR', 'USD'];

// Tipos de beneficio basados en el modelo Django BENEFICIO
export const tiposBeneficio = [
  'Capacitacion', 'Capital de riesgo', 'Creditos', 'Garantias', 
  'Incentivo mujeres', 'Otros incentivos', 'Subsidios'
];

// Mapeo de tipos de beneficio del frontend a códigos del backend
export const tipoBeneficioMapping: Record<string, string> = {
  'Capacitacion': 'CAP',
  'Capital de riesgo': 'RIE',
  'Creditos': 'CRE',
  'Garantias': 'GAR',
  'Incentivo mujeres': 'MUJ',
  'Otros incentivos': 'OTR',
  'Subsidios': 'SUB'
};

// Estados basados en el modelo Django ESTADO
export const estados = [
  'Próximo', 'Abierto', 'En evaluación', 'Adjudicado', 
  'Suspendido', 'Patrocinio Institucional', 'Desierto', 'Cerrado'
];

// Mapeo de estados del frontend a códigos del backend
export const estadoMapping: Record<string, string> = {
  'Próximo': 'PRX',
  'Abierto': 'ABI',
  'En evaluación': 'EVA',
  'Adjudicado': 'ADJ',
  'Suspendido': 'SUS',
  'Patrocinio Institucional': 'PAY',
  'Desierto': 'DES',
  'Cerrado': 'CER'  // Nota: En el modelo backend está "CER": "Cerrrado" (con doble 'r')
};

export const orderOptions = [
  { value: 'none', label: 'Sin orden' },
  { value: 'amount-desc', label: 'Monto (mayor a menor valor)' },
  { value: 'amount-asc', label: 'Monto (menor a mayor valor)' },
  { value: 'open-date', label: 'Fecha de apertura (la más cercana)', decorative: true },
  { value: 'close-date', label: 'Fecha de cierre (la más lejana)', decorative: true },
];

export const showOptions = [ 
    { value: 8, label: '8' }, 
    { value: 15, label: '15' }, 
    { value: 25, label: '25' }, 
    { value: 40, label: '40' }, 
    { value: 999, label: 'Todas' }];

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
