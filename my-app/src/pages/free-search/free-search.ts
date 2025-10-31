import type { FreeSearchCard as FreeSearchCardType } from '../../components/free-search-card/free-search-card.ts';
import type { FiltersValues, OrderOption } from '../../components/filters-component/filters-component.ts';
import { regionMapping, tipoBeneficioMapping } from '../../components/filters-component/filters-component.ts';
import { estadoMapping, estadoMappingInverse } from '../../components/filters-component/filters-component.ts';

// Crear mappings inversos para mostrar nombres legibles en la UI
const regionMappingInverse = Object.fromEntries(
  Object.entries(regionMapping).map(([key, value]) => [value, key])
);

const tipoBeneficioMappingInverse = Object.fromEntries(
  Object.entries(tipoBeneficioMapping).map(([key, value]) => [value, key])
);

// Usar el estadoMappingInverse importado desde filters-component

// Funciones utilitarias para convertir códigos a nombres legibles
export function getRegionDisplayName(regionCode: string): string {
  return regionMappingInverse[regionCode] || regionCode;
}

export function getTipoBeneficioDisplayName(tipoBeneficioCode: string): string {
  return tipoBeneficioMappingInverse[tipoBeneficioCode] || tipoBeneficioCode;
}

export function getEstadoDisplayName(estadoCode: string): string {
  return estadoMappingInverse[estadoCode] || estadoCode;
}

// Constantes iniciales
export const initialFilters: FiltersValues = {
  region: '',
  amountMin: '',
  amountMax: '',
  currency: 'CLP',
  benefitType: '',
  status: '',
};

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

export function filterCards(
  cards: FreeSearchCardType[], 
  filters: FiltersValues
): FreeSearchCardType[] {
  let filteredCards = [...cards];

  // Filtrar por región/alcance
  if (filters.region && filters.region !== '') {
    const regionCode = regionMapping[filters.region];
    filteredCards = filteredCards.filter(card => {
      return card.alcance === regionCode || card.alcance === 'NA'; // NA = Nacional
    });
  }

  // Filtrar por tipo de beneficio
  if (filters.benefitType && filters.benefitType !== '') {
    const benefitCode = tipoBeneficioMapping[filters.benefitType];
    filteredCards = filteredCards.filter(card => {
      return card.tipoDeBeneficio === benefitCode;
    });
  }

  // Filtrar por estado
  if (filters.status && filters.status !== '') {
    const statusCode = estadoMapping[filters.status];
    console.log(`Filtrando por estado: "${filters.status}" → código: "${statusCode}"`);
    
    filteredCards = filteredCards.filter(card => {
      // Si el instrumento tiene estado directo del backend, usar ese
      if (card.estado && card.estado.trim() !== '') {
        const match = card.estado === statusCode;
        if (!match) {
          console.log(`Estado no coincide: card.estado="${card.estado}" vs statusCode="${statusCode}"`);
        }
        return match;
      }
      
      // Si no tiene estado directo, calcular basado en fechas como fallback
      const now = new Date();
      const fechaApertura = card.fechaApertura ? new Date(card.fechaApertura) : null;
      const fechaCierre = card.fechaCierre ? new Date(card.fechaCierre) : null;
      
      console.log(`Card sin estado directo, usando fechas. Título: "${card.title}"`);
      
      // Solo usar cálculo de fechas para estados básicos
      if (statusCode === 'ABI') { // Abierto
        return fechaApertura && fechaCierre && now >= fechaApertura && now <= fechaCierre;
      } else if (statusCode === 'CER') { // Cerrado
        return fechaCierre && now > fechaCierre;
      } else if (statusCode === 'PRX') { // Próximo
        return fechaApertura && now < fechaApertura;
      }
      
      // Para otros estados (EVA, ADJ, SUS, PAY, DES), solo filtrar si tiene estado directo
      return false;
    });
    
    console.log(`Después del filtro de estado: ${filteredCards.length} cards restantes`);
  }

  // Filtrar por monto
  filteredCards = filterCardsByAmount(filteredCards, filters);

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
  } else if (order === 'open-date') {
    // Fecha de apertura: filtrar por fecha de cierre vigente, ordenar por fecha de apertura de más antigua a más futura
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Resetear horas para comparar solo fechas
    
    // Filtrar solo instrumentos que aún no han cerrado (fecha de cierre futura o de hoy)
    const openCards = sortedCards.filter(card => {
      if (!card.fechaCierre) return true; // Si no tiene fecha de cierre, asumimos que está abierto
      const closeDate = new Date(card.fechaCierre);
      closeDate.setHours(0, 0, 0, 0);
      return closeDate >= currentDate;
    });
    
    // Ordenar por fecha de apertura: desde la más antigua hasta la más futura (cronológicamente)
    return openCards.sort((a, b) => {
      const dateA = a.fechaApertura ? new Date(a.fechaApertura) : new Date(0);
      const dateB = b.fechaApertura ? new Date(b.fechaApertura) : new Date(0);
      return dateA.getTime() - dateB.getTime();
    });
  } else if (order === 'close-date') {
    // Fecha de cierre: filtrar solo fechas futuras o de hoy, ordenar de más lejana a más cercana
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Resetear horas para comparar solo fechas
    
    // Filtrar solo instrumentos con fecha de cierre futura o de hoy
    const futureCards = sortedCards.filter(card => {
      if (!card.fechaCierre) return false;
      const cardDate = new Date(card.fechaCierre);
      cardDate.setHours(0, 0, 0, 0);
      return cardDate >= currentDate;
    });
    
    // Ordenar de fecha más lejana a más cercana
    return futureCards.sort((a, b) => {
      const dateA = new Date(a.fechaCierre!);
      const dateB = new Date(b.fechaCierre!);
      return dateB.getTime() - dateA.getTime();
    });
  }
  
  return sortedCards;
}

// Array vacío por defecto para usar solo datos del backend
export const initialCards: FreeSearchCardType[] = [];

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

  // Debug: verificar el estado que viene del backend
  //if (instrumento.Estado) {
  //  console.log(`Instrumento "${instrumento.Titulo}" - Estado backend: "${instrumento.Estado}"`);
  //}

  const mappedCard = {
    id: instrumento.ID, // Agregar el ID del instrumento
    title: instrumento.Titulo || 'Título no disponible',
    description: instrumento.Descripcion || 'Descripción no disponible',
    topic: getTipoBeneficioDisplayName(instrumento.TipoDeBeneficio) || 'General', // Mostrar nombre legible
    benefit: benefit,
    image: imageUrl,
    fechaApertura: instrumento.FechaDeApertura,
    fechaCierre: instrumento.FechaDeCierre,
    link: instrumento.EnlaceDelDetalle,
    alcance: instrumento.Alcance, // Mantener código del backend para filtrado
    estado: instrumento.Estado, // Mantener código del backend para filtrado
    tipoDePerfil: instrumento.TipoDePerfil, // Mantener código del backend
    tipoDeBeneficio: instrumento.TipoDeBeneficio, // Agregar código del backend para filtrado
    // Agregar versiones legibles para display si es necesario
    regionDisplay: getRegionDisplayName(instrumento.Alcance),
    estadoDisplay: getEstadoDisplayName(instrumento.Estado)
  };
  return mappedCard;
}

export function mapInstrumentsToCards(instrumentos: any[]): FreeSearchCardType[] {
  if (!instrumentos || instrumentos.length === 0) {
    return [];
  }
  const mappedCards = instrumentos.map(mapInstrumentToCard);
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