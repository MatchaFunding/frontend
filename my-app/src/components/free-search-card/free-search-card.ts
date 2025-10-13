////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Estructura de los datos que se muestran en la card

/*
Propongo expandir esta carta para incluir mas informacion respecto a los fondos
*/
export interface FreeSearchCard {
  id?: number; // ID del instrumento
  title?: string;
  description?: string;
  topic?: string;
  benefit?: string;
  image?: string;
  fechaApertura?: string;
  fechaCierre?: string;
  link?: string;
  alcance?: string; // Región/alcance del instrumento (código del backend)
  estado?: string; // Estado del instrumento (código del backend)
  tipoDePerfil?: string; // Tipo de perfil (código del backend)
  tipoDeBeneficio?: string; // Tipo de beneficio (código del backend) para filtrado
  regionDisplay?: string; // Nombre legible de la región
  estadoDisplay?: string; // Nombre legible del estado
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Constantes
export const DEFAULT_IMAGE = "/sin-foto.png";
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Toma un string que representa un monto y le quita todos los puntos
export const formatAmount = (amount: string): string => {
  return amount.replace(/\./g, '');
};
// Determina si el string representa un monto económico.
export const isBenefitAmount = (benefit: string): boolean => {
  if (!benefit) return false;
  
  const benefitParts = benefit.split(',');
  return benefitParts.length === 2 && !isNaN(Number(benefitParts[0].replace(/\./g, '')));
};
// Analiza el string y determina si representa un monto económico, además de separar sus partes.
export const parseBenefit = (benefit: string): { isAmount: boolean; parts: string[] } => {
  if (!benefit) {
    return {
      isAmount: false,
      parts: []
    };
  }
  
  const benefitParts = benefit.split(',');
  const isAmount = benefitParts.length === 2 && !isNaN(Number(benefitParts[0].replace(/\./g, '')));
  return {
    isAmount,
    parts: benefitParts
  };
};
// Devuelve una versión formateada si es plata
export const getBenefitDisplayValue = (benefit: string): string => {
  if (!benefit) return 'Beneficio no disponible';
  
  const { isAmount, parts } = parseBenefit(benefit);
  if (isAmount) {
    return `$${parts[0]} ${parts[1]}`;
  }
  return benefit;
};
// Devuelve el nombre de la clase CSS que se debe aplicar según si el beneficio es un monto económico o no
export const getBenefitClassName = (benefit: string): string => {
  if (!benefit) return "free-search-card__benefit";
  
  const { isAmount } = parseBenefit(benefit);
  return isAmount ? "free-search-card__amount" : "free-search-card__benefit";
};

// Función para formatear fechas
export const formatDate = (dateString?: string): string => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch (error) {
    return dateString; // Devolver la cadena original si no se puede formatear
  }
};
