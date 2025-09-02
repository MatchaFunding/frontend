///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
import type { FreeSearchCard as FreeSearchCardType } from '../../components/free-search-card/free-search-card.ts';
import type { FiltersValues, OrderOption } from '../../components/filters-component/filters-component.ts';
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
  console.log('mapInstrumentToCard - instrumento individual:', instrumento);
  
  const benefit = formatAmount(instrumento.MontoMaximo);
  const imageUrl = validateImageUrl(instrumento.EnlaceDeLaFoto);

  const mappedCard = {
    title: instrumento.Titulo || 'Título no disponible',
    description: instrumento.Descripcion || 'Descripción no disponible',
    topic: instrumento.TipoDeBeneficio || 'General',
    benefit: benefit,
    image: imageUrl,
    fechaApertura: instrumento.FechaDeApertura,
    fechaCierre: instrumento.FechaDeCierre
  };
  
  console.log('Card mapeada individual:', mappedCard);
  return mappedCard;
}

export function mapInstrumentsToCards(instrumentos: any[]): FreeSearchCardType[] {
  console.log('mapInstrumentsToCards - instrumentos recibidos:', instrumentos);
  console.log('mapInstrumentsToCards - length:', instrumentos?.length);
  
  if (!instrumentos || instrumentos.length === 0) {
    console.log('No hay instrumentos, retornando array vacío');
    return [];
  }
  
  const mappedCards = instrumentos.map(mapInstrumentToCard);
  console.log('Cards mapeadas:', mappedCards);
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