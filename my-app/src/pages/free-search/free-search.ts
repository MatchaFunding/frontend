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
  const benefitParts = benefit.split(',');
  return benefitParts.length === 2 && !isNaN(Number(benefitParts[0].replace(/\./g, '')));
}

export function filterCardsByAmount(
  cards: FreeSearchCardType[], 
  filters: FiltersValues
): FreeSearchCardType[] {
  if (!filters.amountMin && !filters.amountMax) return cards;
  
  return cards.filter(card => {
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
    return sortedCards.sort((a, b) => a.title.localeCompare(b.title));
  } else if (order === 'amount-desc') {
    const amountCards = sortedCards.filter(card => isBenefitAmount(card.benefit));
    return amountCards.sort((a, b) => parseAmount(b.benefit) - parseAmount(a.benefit));
  } else if (order === 'amount-asc') {
    const amountCards = sortedCards.filter(card => isBenefitAmount(card.benefit));
    return amountCards.sort((a, b) => parseAmount(a.benefit) - parseAmount(b.benefit));
  }
  
  return sortedCards;
}

export function generateRandomCards(count: number): FreeSearchCardType[] {
  const topics = ['Educación', 'Salud', 'Cultura', 'Ciencia', 'Medio Ambiente', 'Emprendimiento'];
  const images = ['/prueba.png', '/anid.jpg'];
  
  return Array.from({ length: count }, (_, i) => ({
    title: `Fondo Extra ${i + 1}`,
    description: `Descripción inventada para el fondo número ${i + 1}.`,
    topic: topics[i % topics.length],
    benefit: i % 3 === 0 
      ? `${Math.floor(Math.random() * 200 + 50)}.000.000,CLP` 
      : `Beneficio de texto para el fondo ${i + 1} que puede ser más largo y descriptivo`,
    image: images[i % images.length],
  }));
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Datos de ejemplo
export const baseCards: FreeSearchCardType[] = [
  { title: 'Fondo de Innovación Educativa', description: 'Financiamiento para proyectos que desarrollen soluciones innovadoras en el sector educativo.', topic: 'Educación', benefit: '150.000.000,CLP', image: '/prueba.png' },
  { title: 'Fondo de Innovación Educativa', description: 'Financiamiento para proyectos que desarrollen soluciones innovadoras en el sector educativo.', topic: 'Educación', benefit: '150.000.000,CLP', image: '/anid.jpg' },
  { title: 'Fondo de Innovación Educativa', description: 'Financiamiento para proyectos que desarrollen soluciones innovadoras en el sector educativo.', topic: 'Educación', benefit: '150.000.000,CLP', image: '/prueba.png' },
  { title: 'Fondo de Innovación Educativa', description: 'Financiamiento para proyectos que desarrollen soluciones innovadoras en el sector educativo.', topic: 'Educación', benefit: '150.000.000,CLP', image: '/anid.jpg' },
  { title: 'Fondo de Innovación Educativaaaaaaaaaaaaaaaaaaaaaa', description: 'Financiamiento para proyectos que desarrollen soluciones innovadoras en el sector educativoaaaaaaaaaaaaaaaaaaaaaaaa.', topic: 'Educación', benefit: '150.000.000,CLP', image: '/prueba.png' },
  { title: 'Fondo Verde Sustentable', description: 'Apoyo financiero para proyectos de energías renovables y sostenibilidad ambiental.', topic: 'Medio Ambiente', benefit: '200.000.000,CLP', image: '/anid.jpg' },
  { title: 'Fondo Mujer Emprende', description: 'Financiamiento para emprendimientos liderados por mujeres en cualquier rubro.', topic: 'Emprendimiento', benefit: '100.000.000,CLP', image: '/prueba.png' },
  { title: 'Fondo Salud Digital', description: 'Recursos para proyectos de innovación tecnológica en el área de la salud.', topic: 'Salud', benefit: '180.000.000,CLP', image: '/anid.jpg' },
  { title: 'Fondo Cultura Viva', description: 'Apoyo a iniciativas culturales y artísticas a nivel nacional.', topic: 'Cultura', benefit: '120.000.000,CLP', image: '/prueba.png' },
  { title: 'Fondo Ciencia Joven', description: 'Financiamiento para jóvenes investigadores y proyectos científicos emergentes.', topic: 'Ciencia', benefit: '90.000.000,CLP', image: '/anid.jpg' },
];

export const initialCards: FreeSearchCardType[] = [
  ...baseCards,
  ...generateRandomCards(40)
];