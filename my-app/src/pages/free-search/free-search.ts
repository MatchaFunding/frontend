///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
import type { FreeSearchCard as FreeSearchCardType } from '../../components/free-search-card/free-search-card.ts';
import type { FiltersValues, OrderOption } from '../../components/filters-component/filters-component.ts';
import { regionMapping, tipoBeneficioMapping, estadoMapping } from '../../components/filters-component/filters-component.ts';
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Constantes iniciales
export const initialFilters: FiltersValues = {
  region: '',
  amountMin: '',
  amountMax: '',
  currency: 'CLP',
  benefitType: '',
  status: '',
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Funciones de utilidad
export function parseAmount(benefit: string): number {
  if (!benefit) return 0;
  
  // Primero verificar si el beneficio tiene formato "numero,currency"
  const benefitParts = benefit.split(',');
  if (benefitParts.length === 2 && !isNaN(Number(benefitParts[0].replace(/\./g, '')))) {
    // Elimina puntos y convierte a número
    return Number(benefitParts[0].replace(/\./g, ''));
  }
  // Si no es formato monetario, devolver 0 para que no interfiera con el ordenamiento
  return 0;
}

export function isBenefitAmount(benefit: string): boolean {
  if (!benefit) return false;
  
  const benefitParts = benefit.split(',');
  return benefitParts.length === 2 && !isNaN(Number(benefitParts[0].replace(/\./g, '')));
}

export function filterCardsByAmount(
  cards: FreeSearchCardType[], 
  filters: FiltersValues
): FreeSearchCardType[] {
  if (!filters.amountMin && !filters.amountMax) return cards;
  
  return cards.filter(card => {
    if (!card.benefit) return false;
    
    const benefitParts = card.benefit.split(',');
    if (benefitParts.length !== 2) return false;
    const amount = Number(benefitParts[0].replace(/\./g, ''));
    const currency = benefitParts[1];
    if (filters.currency && currency !== filters.currency) return false;
    if (filters.amountMin && amount < Number(filters.amountMin)) return false;
    if (filters.amountMax && amount > Number(filters.amountMax)) return false;
    return true;
  });
}

export function filterCardsByRegion(
  cards: FreeSearchCardType[], 
  filters: FiltersValues
): FreeSearchCardType[] {
  // Si no hay filtro de región, mostrar todas las cards
  if (!filters.region || filters.region === '') return cards;
  
  console.log('=== FILTRO POR REGIÓN ===');
  console.log('Región seleccionada:', filters.region);
  
  // Obtener el código de región del backend
  const regionCode = regionMapping[filters.region];
  console.log('Código de región mapeado:', regionCode);
  
  if (!regionCode) return cards;
  
  const filteredCards = cards.filter((card) => {
    // Si el alcance está vacío, incluir la card (instrumentos sin región específica)
    if (!card.alcance || card.alcance.trim() === '') {
      return true;
    }
    
    // Verificar si el alcance coincide con el código de región seleccionado
    // También incluir instrumentos nacionales (NA)
    return card.alcance === regionCode || card.alcance === 'NA';
  });
  
  console.log(`Filtro por región aplicado: ${cards.length} → ${filteredCards.length} cards`);
  return filteredCards;
}

export function filterCardsByBenefitType(
  cards: FreeSearchCardType[], 
  filters: FiltersValues
): FreeSearchCardType[] {
  // Si no hay filtro de tipo de beneficio, mostrar todas las cards
  if (!filters.benefitType || filters.benefitType === '') return cards;
  
  console.log('=== FILTRO POR TIPO DE BENEFICIO ===');
  console.log('Tipo de beneficio seleccionado:', filters.benefitType);
  
  // Obtener el código de tipo de beneficio del backend
  const benefitTypeCode = tipoBeneficioMapping[filters.benefitType];
  console.log('Código de tipo de beneficio mapeado:', benefitTypeCode);
  
  if (!benefitTypeCode) {
    console.log('No se encontró mapeo para el tipo de beneficio:', filters.benefitType);
    return cards;
  }
  
  console.log('Tipos de beneficio en las cards:', [...new Set(cards.map(card => card.tipoDeBeneficio).filter(Boolean))]);
  
  const filteredCards = cards.filter((card) => {
    // Si el tipo de beneficio está vacío, incluir la card
    if (!card.tipoDeBeneficio || card.tipoDeBeneficio.trim() === '') {
      return true;
    }
    
    // Verificar si el tipo de beneficio coincide con el código seleccionado
    return card.tipoDeBeneficio === benefitTypeCode;
  });
  
  console.log(`Filtro por tipo de beneficio aplicado: ${cards.length} → ${filteredCards.length} cards`);
  return filteredCards;
}

export function filterCardsByStatus(
  cards: FreeSearchCardType[], 
  filters: FiltersValues
): FreeSearchCardType[] {
  // Si no hay filtro de estado, mostrar todas las cards
  if (!filters.status || filters.status === '') return cards;
  
  console.log('=== FILTRO POR ESTADO ===');
  console.log('Estado seleccionado:', filters.status);
  
  // Obtener el código de estado del backend
  const statusCode = estadoMapping[filters.status];
  console.log('Código de estado mapeado:', statusCode);
  
  if (!statusCode) return cards;
  
  const filteredCards = cards.filter((card) => {
    // Si el estado está vacío, incluir la card
    if (!card.estado || card.estado.trim() === '') {
      return true;
    }
    
    // Verificar si el estado coincide con el código seleccionado
    return card.estado === statusCode;
  });
  
  console.log(`Filtro por estado aplicado: ${cards.length} → ${filteredCards.length} cards`);
  return filteredCards;
}

export function filterCards(
  cards: FreeSearchCardType[], 
  filters: FiltersValues
): FreeSearchCardType[] {
  console.log('=== APLICANDO FILTROS ===');
  console.log('Cards iniciales:', cards.length);
  console.log('Filtros aplicados:', filters);
  
  let filteredCards = filterCardsByAmount(cards, filters);
  console.log('Después de filtro por monto:', filteredCards.length);
  
  filteredCards = filterCardsByRegion(filteredCards, filters);
  console.log('Después de filtro por región:', filteredCards.length);
  
  filteredCards = filterCardsByBenefitType(filteredCards, filters);
  console.log('Después de filtro por tipo de beneficio:', filteredCards.length);
  
  filteredCards = filterCardsByStatus(filteredCards, filters);
  console.log('Después de filtro por estado:', filteredCards.length);
  
  console.log('=== RESULTADO FINAL ===');
  console.log(`Total de cards filtradas: ${filteredCards.length}`);
  console.log('Cards finales:', filteredCards.map(card => ({
    title: card.title,
    alcance: card.alcance,
    tipoDeBeneficio: card.tipoDeBeneficio,
    estado: card.estado
  })));
  
  return filteredCards;
}

export function sortCards(
  cards: FreeSearchCardType[], 
  order: OrderOption
): FreeSearchCardType[] {
  const sortedCards = [...cards];
  
  if (order === 'title-asc') {
    return sortedCards.sort((a, b) => {
      const titleA = a.title || '';
      const titleB = b.title || '';
      return titleA.localeCompare(titleB);
    });
  } else if (order === 'amount-desc') {
    const amountCards = sortedCards.filter(card => card.benefit && isBenefitAmount(card.benefit));
    return amountCards.sort((a, b) => {
      const benefitA = a.benefit || '';
      const benefitB = b.benefit || '';
      return parseAmount(benefitB) - parseAmount(benefitA);
    });
  } else if (order === 'amount-asc') {
    const amountCards = sortedCards.filter(card => card.benefit && isBenefitAmount(card.benefit));
    return amountCards.sort((a, b) => {
      const benefitA = a.benefit || '';
      const benefitB = b.benefit || '';
      return parseAmount(benefitA) - parseAmount(benefitB);
    });
  }
  
  return sortedCards;
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Array vacío por defecto para usar solo datos del backend
export const initialCards: FreeSearchCardType[] = [];

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Funciones para manejo de datos del backend

export function formatAmount(amount: number): string {
  if (!amount || amount <= 0) {
    return 'Beneficio por consultar';
  }
  const formattedAmount = amount.toLocaleString('es-CL');
  return `${formattedAmount},CLP`;
}

export function validateImageUrl(imageUrl: string): string {
  return imageUrl && imageUrl.trim() !== '' ? imageUrl : '/sin-foto.png';
}

export function mapInstrumentToCard(instrumento: any): FreeSearchCardType {
  const benefit = formatAmount(instrumento.MontoMaximo);
  const imageUrl = validateImageUrl(instrumento.EnlaceDeLaFoto);

  const mappedCard = {
    title: instrumento.Titulo || 'Título no disponible',
    description: instrumento.Descripcion || 'Descripción no disponible',
    topic: instrumento.TipoDeBeneficio || 'General',
    benefit: benefit,
    image: imageUrl,
    fechaApertura: instrumento.FechaDeApertura,
    fechaCierre: instrumento.FechaDeCierre,
    EnlaceDelDetalle: instrumento.EnlaceDelDetalle,
    // Campos para filtros
    alcance: instrumento.Alcance || '',
    tipoDeBeneficio: instrumento.TipoDeBeneficio || '',
    estado: instrumento.Estado || ''
  };
  
  return mappedCard;
}

export function mapInstrumentsToCards(instrumentos: any[]): FreeSearchCardType[] {
  console.log('=== MAPEO DE INSTRUMENTOS ===');
  console.log('Instrumentos recibidos:', instrumentos?.length || 0);
  
  if (!instrumentos || instrumentos.length === 0) {
    console.log('No hay instrumentos, retornando array vacío');
    return [];
  }
  
  // Verificar qué tipos de beneficio existen en los datos
  const tiposBeneficioEnDatos = [...new Set(instrumentos.map(inst => inst.TipoDeBeneficio).filter(Boolean))];
  console.log('Tipos de beneficio en los datos del backend:', tiposBeneficioEnDatos);
  
  const mappedCards = instrumentos.map(mapInstrumentToCard);
  console.log('Cards mapeadas exitosamente:', mappedCards.length);
  console.log('Resumen de cards:', mappedCards.map(card => ({
    title: card.title,
    alcance: card.alcance,
    tipoDeBeneficio: card.tipoDeBeneficio,
    estado: card.estado
  })));
  
  return mappedCards;
}

export function calculatePagination(
  totalCards: number, 
  cardsPerPage: number, 
  currentPage: number
) {
  const totalPages = Math.ceil(totalCards / cardsPerPage);
  const startIndex = (currentPage - 1) * cardsPerPage;
  const endIndex = startIndex + cardsPerPage;
  
  return {
    totalPages,
    startIndex,
    endIndex,
    paginatedIndices: { start: startIndex, end: endIndex }
  };
}

export function getPaginatedCards<T>(cards: T[], page: number, cardsPerPage: number): T[] {
  const { startIndex, endIndex } = calculatePagination(cards.length, cardsPerPage, page);
  return cards.slice(startIndex, endIndex);
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Funciones de búsqueda
export function searchCardsByText(cards: FreeSearchCardType[], searchTerm: string): FreeSearchCardType[] {
  if (!searchTerm || searchTerm.trim() === '') {
    return cards;
  }

  const normalizedSearchTerm = searchTerm.toLowerCase().trim();
  
  return cards.filter(card => 
    card.title?.toLowerCase().includes(normalizedSearchTerm) ||
    card.description?.toLowerCase().includes(normalizedSearchTerm) ||
    card.topic?.toLowerCase().includes(normalizedSearchTerm)
  );
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Funciones para manejo de eventos
export function createHandlePageChange(
  setPage: (page: number) => void,
  totalPages: number
) {
  return {
    goToPage: (page: number) => {
      if (page >= 1 && page <= totalPages) {
        setPage(page);
      }
    },
    goToNext: (currentPage: number) => {
      if (currentPage < totalPages) {
        setPage(currentPage + 1);
      }
    },
    goToPrevious: (currentPage: number) => {
      if (currentPage > 1) {
        setPage(currentPage - 1);
      }
    }
  };
}