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
// Datos estáticos
export const regionesChile = 
['Arica y Parinacota', 'Tarapacá', 'Antofagasta', 'Atacama', 
'Coquimbo', 'Valparaíso', 'Metropolitana de Santiago', 'Libertador General Bernardo O\'Higgins', 
'Maule', 'Ñuble', 'Biobío', 'La Araucanía', 
'Los Ríos', 'Los Lagos', 'Aysén del General Carlos Ibáñez del Campo', 'Magallanes y de la Antártica Chilena'];

export const monedas = ['CLP', 'EUR', 'USD'];

export const tiposBeneficio = [
  'Financiamiento', 'Capacitación', 'Asesoría', 'Networking', 'Difusión', 
  'Infraestructura', 'Mentoría', 'Acceso a mercados', 'Premios', 'Certificación'
];

export const estados = ['Activo', 'No activo'];

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
